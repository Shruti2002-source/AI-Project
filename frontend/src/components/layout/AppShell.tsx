'use client'
import React from 'react'
import Sidebar from './Sidebar'

interface Props {
  children: React.ReactNode
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
