'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/schemas/messageSchema'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
import { MessageSuggestions } from './MessageSuggestions'

interface MessageFormProps {
  username: string
}

export function MessageForm({ username }: MessageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (data: { content: string }) => {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/message/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          content: data.content,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('User not found')
        } else if (response.status === 403) {
          toast.error('This user is not accepting messages')
        } else {
          toast.error(result.message || 'Failed to send message')
        }
        return
      }

      toast.success('Message sent successfully!')
      form.reset()
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write your message here..."
                  className="min-h-[120px] resize-none border-zinc-800 bg-zinc-900/50 text-zinc-50 placeholder:text-zinc-500 focus:border-zinc-700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
        <MessageSuggestions />
      </form>
    </Form>
  )
} 