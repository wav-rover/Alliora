'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { ChevronUp, ChevronDown, Send } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamChat({ projectId, messages: initialMessages }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)  // État des messages à afficher
  const [newMessage, setNewMessage] = useState('')  // État du champ de saisie du message
  const scrollRef = useRef(null)
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      setUnreadCount(0);
    }
  }, [isOpen, messages])

  useEffect(() => {
    console.log('Écoute du canal privé task.', projectId);

    const channel = window.Echo.private(`task.${projectId}`);

    channel.listen('.message.sent', function (e) {
      console.log('Nouveau message reçu :', e.message);
      setMessages((prevMessages) => [...prevMessages, e.message]);

      if (!isOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    return () => {
      channel.stopListening('.message.sent');
    };
  }, [projectId]);

  // Lors de l'envoi d'un message
  const handleSendMessage = () => {
    event.preventDefault();
    if (!newMessage) return;
    axios.post(`/projects/${projectId}`, { content: newMessage })
      .then((response) => {
        console.log('Message envoyé :', response.data.message);
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi du message :', error);
      })
  }

  return (
    <div
      className="z-40 fixed bottom-0 right-10 w-80 bg-background border border-border rounded-lg rounded-b-none border-b-0 shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height: isOpen ? '400px' : '48px' }}
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2 bg-neutral-900 rounded-b-none text-white rounded-t-lg transition-colors duration-200 hover:bg-neutral-800/90"
        aria-expanded={isOpen}
        aria-controls="chat-messages"
      >
        <div className='space-x-2'>
          <span className="font-semibold">Team Chat</span>
          {!isOpen && unreadCount > 0 && (
            <span className=" bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {unreadCount}
            </span>
          )}
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </Button>
      <div
        className="bg-background p-4 transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0, visibility: isOpen ? 'visible' : 'hidden' }}
      >
        <div
          ref={scrollRef}
          className="h-72 mb-4 pr-4 overflow-y-auto"
          id="chat-messages"
        >
          {messages.map((message) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0.8, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 17,
                duration: 0.3,
              }}
              key={message.id} className="flex items-start mb-4 animate-fadeIn">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src={'/placeholder.svg?height=32&width=32'} alt="aa" />
                <AvatarFallback>{message.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="bg-secondary p-2 rounded-lg">
                <p className="font-semibold text-sm">{message.user.name}</p>
                <p className="text-sm text-secondary-foreground">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center justify-center gap-2 -mt-2">
          <Input
            type="text"
            placeholder="Tapez votre message..."
            className="flex-grow"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}