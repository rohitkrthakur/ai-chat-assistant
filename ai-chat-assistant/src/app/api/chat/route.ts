import { db } from "../../../db"
import { messages as messagesTable } from "../../../db/schema"

export async function POST(req: Request) {
  try {
    const { messages: incomingMessages, chatId } = await req.json()

    // Get the latest message from user
    const userMessage: string =
      incomingMessages[incomingMessages.length - 1]?.content || ""
    const msgLower = userMessage.toLowerCase()

    let aiResponse = ""

    // Handle weather queries
    if (msgLower.includes("weather")) {
      const match = userMessage.match(/weather (?:of|in) ([\w\s]+)/i)
      const location = match ? match[1].trim() : null

      if (!location) {
        aiResponse =
          'Please specify a location, e.g., "weather of London".'
      } else {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            location
          )}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        )
        const data = await res.json()

        if (data?.main) {
          aiResponse = `Weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`
        } else {
          aiResponse = `Could not fetch weather for "${location}".`
        }
      }

      // Handle stock queries
    } else if (msgLower.includes("stock")) {
      const match = userMessage.match(/stock (?:of|for) (\w+)/i)
      const symbol = match ? match[1].trim().toUpperCase() : null

      if (!symbol) {
        aiResponse =
          'Please specify a stock symbol, e.g., "stock of AAPL".'
      } else {
        const res = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        )
        const data = await res.json()
        const quote = data["Global Quote"]

        if (quote) {
          aiResponse = `${quote["01. symbol"]} price: $${parseFloat(
            quote["05. price"]
          ).toFixed(2)}, Change: ${parseFloat(
            quote["09. change"]
          ).toFixed(2)} (${quote["10. change percent"]})`
        } else {
          aiResponse = `Could not fetch stock data for "${symbol}".`
        }
      }

      // Default fallback for unrecognized queries
    } else {
      aiResponse = `You said: ${userMessage}`
    }

    // Save assistant response in database
    if (chatId) {
      await db.insert(messagesTable).values({
        chatId,
        role: "assistant",
        content: aiResponse,
        toolCalls: null,
      })
    }

    return new Response(aiResponse)
  } catch (err: unknown) {
    console.error("Chat API Error:", err)

    let message = "Unknown error"
    if (err instanceof Error) {
      message = err.message
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
    })
  }
}
