'use client'

import { useParams, useRouter } from 'next/navigation'
import { MessageForm } from '@/components/message/MessageForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, MessageSquare, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MessagePage() {
  const params = useParams()
  const router = useRouter()

  return (
    <div className="max-w-3xl mx-auto space-y-8 pt-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/')}
        className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900/50 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      {/* User Profile Section */}
      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-zinc-900/50">
              <User className="h-6 w-6 text-zinc-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-zinc-50">
                Send a Message
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Share your thoughts anonymously with @{params.username}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <User className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-50">@{params.username}</span>
          </div>
          <div className="flex items-center space-x-4 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <MessageSquare className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-50">Your message will be completely anonymous</span>
          </div>
        </CardContent>
      </Card>

      {/* Message Form Section */}
      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-50">
            Your Message
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Write your message below. It will be sent anonymously.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MessageForm username={params.username as string} />
        </CardContent>
      </Card>
    </div>
  )
}
