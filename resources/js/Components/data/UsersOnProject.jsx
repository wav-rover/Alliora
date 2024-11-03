'use client'

import React, { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import AnimatedTooltip from '../ui/animated-tooltip'

export function UserTooltip({ projectId }) {
  const [usersList, setUsersList] = useState([])

  useEffect(() => {
    const presenceChannel = window.Echo.join(`presence.project.${projectId}`)
      .here((users) => {
        setUsersList(users)
      })
      .joining((user) => {
        setUsersList((prevUsers) => [...prevUsers, user])
      })
      .leaving((user) => {
        setUsersList((prevUsers) => prevUsers.filter((u) => u.id !== user.id))
      })
      .error((error) => {
        console.error('Error listening to presence channel:', error)
      })

    return () => {
      presenceChannel.leave()
    }
  }, [projectId])

  return (
  <AnimatedTooltip users={usersList} />
)}

export function MousePositions({ projectId, currentUserId }) {
  const [usersList, setUsersList] = useState([])
  const [mousePositions, setMousePositions] = useState({})

  useEffect(() => {
    const presenceChannel = window.Echo.join(`presence.project.${projectId}`)
      .here((users) => {
        setUsersList(users)
      })
      .joining((user) => {
        setUsersList((prevUsers) => [...prevUsers, user])
      })
      .leaving((user) => {
        setUsersList((prevUsers) => prevUsers.filter((u) => u.id !== user.id))
        setMousePositions((prev) => {
          const newPositions = { ...prev }
          delete newPositions[user.id]
          return newPositions
        })
      })
      .error((error) => {
        console.error('Error listening to presence channel:', error)
      })
      .listenForWhisper('mouse-move', (data) => {
        setMousePositions((prev) => ({
          ...prev,
          [data.userId]: data.position,
        }))
        console.log(data);
      })

    const handleMouseMove = debounce((e) => {
      const position = { x: e.clientX, y: e.clientY }
      setMousePositions((prev) => ({
        ...prev,
        [currentUserId]: position,
      }))
      presenceChannel.whisper('mouse-move', {
        userId: currentUserId,
        position,
      })
    }, 10) // Debounce to limit the number of updates

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      presenceChannel.leave()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [projectId, currentUserId])

  return (
    <div className="">
      {Object.entries(mousePositions).map(([userId, position]) => (
        userId !== currentUserId.toString() && (
          <div
            key={userId}
            className="z-50 absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full opacity-50 pointer-events-none"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="absolute top-4 left-4 text-xs whitespace-nowrap">
              {usersList.find(user => user.id.toString() === userId)?.name || `User ${userId}`}
            </span>
          </div>
        )
      ))}
    </div>
  )
}