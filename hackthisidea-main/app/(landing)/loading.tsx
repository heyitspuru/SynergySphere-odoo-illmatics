"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function LandingLoading() {
  const [progress, setProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          setTimeout(() => setShowContent(true), 500) // Delay before showing content
          return 100
        }
        return prevProgress + 5
      })
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  if (showContent) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
      <div className="animate-scale-up">
        <div className="relative mb-8">
          <Image 
            src="/hackconnect-logo.svg" 
            alt="HackThisIdea Logo" 
            width={120} 
            height={120}
          />
          <div className="absolute inset-0 animate-shimmer rounded-xl"></div>
        </div>
        
        <h1 className="mb-6 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
          HackThisIdea
        </h1>
      </div>
      
      <div className="w-64 h-2 mb-4 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700 animate-fade-in">
        <div 
          className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 animate-fade-in">
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading {progress}%</span>
      </div>
      
      <div className="mt-8 space-y-3 animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse [animation-delay:200ms]"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse [animation-delay:400ms]"></div>
        </div>
      </div>
    </div>
  )
} 