'use client'

import { useState, useEffect } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Sparkles, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useFormContext } from 'react-hook-form'

export function MessageSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const form = useFormContext()

  const { complete, completion, isLoading: isCompleting } = useCompletion({
    api: '/api/message/suggest-message',
    onFinish: () => {
      setIsLoading(false)
    },
    onError: (error) => {
      console.error('Error getting suggestions:', error)
      toast.error('Failed to get suggestions')
      setIsLoading(false)
      setSuggestions([])
    },
  })

  const handleGetSuggestions = async () => {
    try {
      setIsLoading(true)
      setSuggestions([])
      await complete('')
    } catch (error) {
      console.error('Error getting suggestions:', error)
      toast.error('Failed to get suggestions')
      setIsLoading(false)
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue('content', suggestion, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  useEffect(() => {
    if (completion) {
      try {
        const newSuggestions = completion.split('||').filter(Boolean)
        if (newSuggestions.length > 0) {
          setSuggestions(newSuggestions)
        }
      } catch (error) {
        console.error('Error parsing suggestions:', error)
        toast.error('Failed to parse suggestions')
        setSuggestions([])
      }
    }
  }, [completion])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-medium text-zinc-50">AI Suggestions</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGetSuggestions}
          disabled={isLoading || isCompleting}
          className="border-zinc-800 bg-zinc-900/50 text-zinc-50 hover:bg-zinc-800/50 hover:text-zinc-50 transition-all duration-200"
        >
          {isLoading || isCompleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting suggestions...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get suggestions
            </>
          )}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="grid gap-4">
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className="group cursor-pointer border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <MessageSquare className="h-4 w-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                  </div>
                  <p className="text-sm text-zinc-50 leading-relaxed">{suggestion}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 