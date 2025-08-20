// Install: npm install openai
// This bypasses the AI SDK schema issues completely

import OpenAI from 'openai'
import { db } from '../../../db/index'
import { messages as messagesTable } from '../../../db/schema'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Define tools in OpenAI's native format
const tools = [
  {
    type: "function" as const,
    function: {
      name: "getWeather",
      description: "Get current weather for a location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name to get weather for"
          }
        },
        required: ["location"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "getStockPrice", 
      description: "Get stock price for a symbol",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "Stock symbol like AAPL or GOOGL"
          }
        },
        required: ["symbol"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "getF1Race",
      description: "Get next Formula 1 race information", 
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  }
]

// Execute function calls
async function executeFunction(name: string, args: any) {
  console.log(`Executing ${name} with args:`, args)
  
  switch (name) {
    case 'getWeather':
      try {
        const { location } = args
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        )
        if (!res.ok) throw new Error('Weather API failed')
        const data = await res.json()
        
        return {
          success: true,
          data: {
            location: data.name,
            temperature: `${Math.round(data.main.temp)}°C`,
            description: data.weather[0].description,
            humidity: `${data.main.humidity}%`,
            windSpeed: `${data.wind?.speed || 0} m/s`
          }
        }
      } catch (error) {
        return { success: false, error: 'Failed to fetch weather data' }
      }

    case 'getStockPrice':
      try {
        const { symbol } = args
        const res = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        )
        const data = await res.json()
        const quote = data['Global Quote']
        
        if (!quote || Object.keys(quote).length === 0) {
          return { success: false, error: 'Invalid stock symbol or API limit reached' }
        }
        
        return {
          success: true,
          data: {
            symbol: quote['01. symbol'],
            price: `$${parseFloat(quote['05. price']).toFixed(2)}`,
            change: parseFloat(quote['09. change']).toFixed(2),
            changePercent: quote['10. change percent'],
            lastTraded: quote['07. latest trading day']
          }
        }
      } catch (error) {
        return { success: false, error: 'Failed to fetch stock data' }
      }

    case 'getF1Race':
      try {
        const res = await fetch('https://ergast.com/api/f1/current/next.json')
        if (!res.ok) throw new Error('F1 API failed')
        const data = await res.json()
        const race = data.MRData.RaceTable.Races[0]
        
        if (!race) {
          return { success: false, error: 'No upcoming F1 races found' }
        }
        
        return {
          success: true,
          data: {
            raceName: race.raceName,
            circuit: race.Circuit.circuitName,
            location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
            date: race.date,
            time: race.time || 'TBD',
            round: `Round ${race.round}`
          }
        }
      } catch (error) {
        return { success: false, error: 'Failed to fetch F1 data' }
      }

    default:
      return { success: false, error: `Unknown function: ${name}` }
  }
}

export async function POST(req: Request) {
  try {
    const { messages: incomingMessages, chatId } = await req.json()

    console.log('Incoming messages:', incomingMessages?.length)

    // Call OpenAI with tools
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: incomingMessages,
      tools: tools,
      tool_choice: 'auto',
      max_tokens: 1000,
      temperature: 0.7
    })

    const assistantMessage = completion.choices[0].message
    let responseContent = assistantMessage.content || ''
    let toolResults: any[] = []

    // Handle tool calls
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log('Tool calls detected:', assistantMessage.tool_calls.length)
      
      for (const toolCall of assistantMessage.tool_calls) {
        try {
          // Access function call details safely
          const fnCall = toolCall.type === "function" ? toolCall : (toolCall as any)
          const args = JSON.parse(fnCall.function?.arguments || '{}')
          const result = await executeFunction(fnCall.function?.name, args)
          toolResults.push({
            name: fnCall.function?.name,
            result: result
          })
          
          // Format tool result for response
          if (result.success) {
            const data = result.data
            let formattedResult = ''
            
            switch (fnCall.function?.name) {
              case 'getWeather':
                if (data) {
                  formattedResult = `🌤️ Weather in ${data.location}: ${data.temperature}, ${data.description}. Humidity: ${data.humidity}, Wind: ${data.windSpeed}`
                } else {
                  formattedResult = '🌤️ Weather data is unavailable.'
                }
                break
              case 'getStockPrice':
                const changeValue = data && typeof data.change === 'string' ? data.change : "0";
                const changeColor = parseFloat(changeValue) >= 0 ? '📈' : '📉';
                formattedResult = data
                  ? `${changeColor} ${data.symbol}: ${data.price} (${data.change ?? "N/A"} ${data.changePercent ?? ""}) - Last traded: ${data.lastTraded ?? "N/A"}`
                  : '📈 Stock data is unavailable.';
                break
              case 'getF1Race':
                formattedResult = data
                  ? `🏎️ ${data.raceName}\n📍 ${data.circuit}, ${data.location}\n📅 ${data.date} at ${data.time}\n🏁 ${data.round}`
                  : '🏎️ F1 race data is unavailable.'
                break
            }
            
            responseContent += `\n\n${formattedResult}`
          } else {
            responseContent += `\n\n❌ ${result.error}`
          }
        } catch (error) {
          console.error('Tool execution error:', error)
          const functionName = (toolCall as any).function?.name ?? 'unknown function';
          responseContent += `\n\n❌ Error executing ${functionName}`
        }
      }
    }

    // Save to database
    if (chatId) {
      try {
        await db.insert(messagesTable).values({
          chatId,
          role: 'assistant',
          content: responseContent,
          toolCalls: assistantMessage.tool_calls || null
        })
      } catch (dbError) {
        console.error('Database save error:', dbError)
      }
    }

    return Response.json({ 
      content: responseContent,
      toolResults: toolResults,
      usage: completion.usage
    })

  } catch (err: any) {
    console.error('OpenAI API Error:', err)
    
    // Fallback: Simple chat without tools
    try {
      const { messages: incomingMessages } = await req.json()
      const fallbackCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: incomingMessages,
        max_tokens: 500
      })
      
      return Response.json({ 
        content: fallbackCompletion.choices[0].message.content,
        fallback: true
      })
    } catch (fallbackError) {
      return Response.json({ 
        error: 'Failed to generate response',
        details: err.message 
      }, { status: 500 })
    }
  }
}