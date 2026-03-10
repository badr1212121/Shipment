import { useEffect } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

export default function WebSocketListener({ onMessage, onConnected, onDisconnected }) {
  useEffect(() => {
    const socket = new SockJS('/ws')
    const stomp = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        onConnected?.()
        stomp.subscribe('/topic/shipments', (msg) => {
          try {
            const body = JSON.parse(msg.body)
            onMessage?.(body)
          } catch {
            onMessage?.(msg.body)
          }
        })
      },
      onDisconnect: () => {
        onDisconnected?.()
      },
    })
    stomp.activate()
    return () => {
      onDisconnected?.()
      stomp.deactivate()
    }
  }, [onMessage, onConnected, onDisconnected])

  return null
}
