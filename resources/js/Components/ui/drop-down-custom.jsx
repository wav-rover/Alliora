'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from './badge'

export default function DropDownCustom({ notifications }) {
    const [isOpen, setIsOpen] = useState(false)
    const [hasNewNotifications, setHasNewNotifications] = useState(false)
    const [localNotifications, setLocalNotifications] = useState(notifications)
    const dropdownRef = useRef(null)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
        if (isOpen) {
            setHasNewNotifications(false)
        }
    }

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

    useEffect(() => {
        if (notifications.length > 0) {
            setHasNewNotifications(true)
        }
        setLocalNotifications(notifications)
    }, [notifications])

    const handleDeleteNotification = (index) => {
        const updatedNotifications = localNotifications.filter((_, i) => i !== index)
        setLocalNotifications(updatedNotifications)
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
    }

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
                            {localNotifications.length > 0 ? (
                                localNotifications.map((notification, index) => (
                                    <motion.li
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={index}
                                        className="p-2 transition-colors"
                                    >
                                        <div className='p-3 flex flex-col items-start gap-1 bg-neutral-800/50 rounded-xl'>
                                            <div className="flex justify-between w-full">
                                                <div>{notification.message}</div>
                                                <button onClick={() => handleDeleteNotification(index)} className="text-neutral-500 hover:text-neutral-700">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className={'text-xs p-2 py-1 rounded-full bg-blue-800/40'}>
                                                {notification.teamName}
                                            </div>
                                        </div>
                                    </motion.li>
                                ))
                            ) : (
                                <p className="p-4 text-center text-white">No new notifications</p>
                            )}
                        </ul>
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
                {hasNewNotifications && !isOpen && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400"
                    />
                )}
            </motion.button>
        </div>
    )
}