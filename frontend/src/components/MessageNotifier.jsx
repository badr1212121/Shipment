import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

const MESSAGE_EVENT = 'message-notifier-update'

export function emitUnreadUpdate() {
  window.dispatchEvent(new CustomEvent(MESSAGE_EVENT))
}

export default function MessageNotifier() {
  const { userId, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated || !userId) return

    const socket = new SockJS('/ws')
    const stomp = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stomp.subscribe(`/topic/user/${userId}/messages`, (msg) => {
          try {
            const body = JSON.parse(msg.body)
            const title = `New message from ${body.senderUsername || 'Someone'}`
            const desc = body.subject || body.preview || ''
            const role = body.senderRole ? ` (${body.senderRole})` : ''
            toast({
              title: `💬 ${title}${role}`,
              description: desc,
              action: (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/messages')}
                >
                  Open
                </Button>
              ),
            })
            emitUnreadUpdate()
          } catch {
            emitUnreadUpdate()
          }
        })
      },
    })
    stomp.activate()
    return () => stomp.deactivate()
  }, [userId, isAuthenticated, toast, navigate])

  return null
}
