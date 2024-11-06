'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from './badge'

export default function DropDownCustom() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const toggleMenu = () => setIsOpen(!isOpen)

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const notifications = [
        { id: 1, message: "Nouveau message reçu", type: "Projects" },
        { id: 2, message: "Votre publication a été aimée", type: "Projects" },
        { id: 3, message: "Vous avez un nouveau follower", type: "Teams" },
    ]

    return (
        <div className="fixed top-5 right-10 z-50" ref={dropdownRef}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        style={{ originX: 1, originY: 0 }}
                        className="absolute text-gray-300 top-0 right-0 w-80 h-82 bg-neutral-900/95 rounded-2xl shadow-xl overflow-hidden z-10"
                    >
                        <div className="p-4 pb-2">
                            <h2 className="text-lg font-semibold">Notifications</h2>
                        </div>

                        <ul className="max-h-80 overflow-y-auto">
                            {notifications.map((notification) => (
                                <motion.li
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}

                                    key={notification.id}
                                    className="p-2 transition-colors"
                                >
                                    <div className='p-3 flex flex-col items-start gap-1 bg-neutral-800/50 rounded-xl'>
                                        {notification.message}
                                        <div className={'text-xs p-2 py-1 rounded-full bg-blue-800/40'}>
                                            {notification.type}
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>

                        {notifications.length === 0 && (
                            <p className="p-4 text-center text-white">Pas de nouvelles notifications</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={toggleMenu}
                className={`relative z-20 text-black p-3 rounded-2xl hover:bg-gray-100 transition-colors`}
                aria-label={isOpen ? "Fermer les notifications" : "Ouvrir les notifications"}
                animate={isOpen ? { backgroundColor: '#171717', color: '#e1e1e1' } : { backgroundColor: '#e1e1e1', color: "#171717" }}
                transition={{ duration: 0.1 }}
            >
                {isOpen ? (
                    <X className="h-4 w-4" />
                ) : (
                    <Bell className="h-4 w-4" />
                )}
            </motion.button>
        </div>
    )
}