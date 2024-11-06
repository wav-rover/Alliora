'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronUp, ChevronDown, Send } from 'lucide-react'

const messages = [
  { id: 1, user: 'Alice', content: 'Salut tout le monde !', avatar: '/placeholder.svg?height=32&width=32' },
  { id: 2, user: 'Bob', content: 'Hey Alice, comment ça va ?', avatar: '/placeholder.svg?height=32&width=32' },
  { id: 3, user: 'Charlie', content: 'Je viens de terminer le nouveau design !', avatar: '/placeholder.svg?height=32&width=32' },
  { id: 4, user: 'David', content: 'Super ! Hâte de voir ça.', avatar: '/placeholder.svg?height=32&width=32' },
]

export default function TeamChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="z-40 fixed bottom-0 right-10 w-80 bg-background border border-border rounded-lg rounded-b-none border-b-0 shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height: isOpen ? '400px' : '48px' }}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2 bg-neutral-900 rounded-b-none text-white rounded-t-lg transition-colors duration-200 hover:bg-neutral-800/90"
        aria-expanded={isOpen}
        aria-controls="chat-messages"
      >
        <span className="font-semibold">Chat d'équipe</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </Button>
      <div className="bg-background p-4 transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0, visibility: isOpen ? 'visible' : 'hidden' }}>
        <ScrollArea className="h-72 mb-4 pr-4" id="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start mb-4 animate-fadeIn">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src={message.avatar} alt={message.user} />
                <AvatarFallback>{message.user[0]}</AvatarFallback>
              </Avatar>
              <div className="bg-secondary p-2 rounded-lg">
                <p className="font-semibold text-sm">{message.user}</p>
                <p className="text-sm text-secondary-foreground">{message.content}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="flex items-center justify-center gap-2 -mt-2">
          <Input
            type="text"
            placeholder="Tapez votre message..."
            className="flex-grow"
          />
          <Button size="icon" className="p-3 bg-neutral-800 text-white hover:bg-neutral-800/90 transition-colors duration-200">
            <Send className="h-4 w-4" />
            <span className="sr-only">Envoyer</span>
          </Button>
        </div>
      </div>
    </div>
  )
}