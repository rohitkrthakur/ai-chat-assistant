"use client"

import { useState, useEffect, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CardContent } from "@/components/ui/card"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [clientLoaded, setClientLoaded] = useState(false) // ensures client-only rendering

  useEffect(() => {
    setClientLoaded(true)
  }, [])

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(), // SSR-safe unique id
      role: "user",
      content: input,
    }

    addMessage(userMessage)
    setInput("")
    setIsLoading(true)

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    }
    addMessage(assistantMessage)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage.content += chunk

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id ? { ...msg, content: assistantMessage.content } : msg
          )
        )
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Oops! Something went wrong." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!clientLoaded) return null // avoid SSR mismatch

  return (
    <>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="self-start bg-gray-200 text-black px-4 py-2 rounded-lg max-w-[70%]">
                Hey! How can I help you today?
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`px-4 py-2 rounded-lg max-w-[70%] ${
                  message.role === "user"
                    ? "self-end bg-blue-600 text-white"
                    : "self-start bg-gray-200 text-black"
                }`}
              >
                {message.content}
              </div>
            ))}

            {isLoading && (
              <div className="self-start bg-gray-200 text-black px-4 py-2 rounded-lg max-w-[70%]">
                Typing...
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </>
  )
}
