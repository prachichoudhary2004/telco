import React, { useState } from 'react'
import { X, Copy, Share2, Sparkles, Wand2, Hash, MessageSquare } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { mockAIResponses } from '../utils/mockData'

export default function AIAssistantModal() {
  const { state, closeAIModal } = useApp()
  const [activeTab, setActiveTab] = useState<'captions' | 'hashtags' | 'templates'>('captions')
  const [generatedContent, setGeneratedContent] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  if (!state.aiModalOpen) return null

  const generateContent = async (type: 'captions' | 'hashtags' | 'templates') => {
    setIsGenerating(true)
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    let content: string[] = []
    switch (type) {
      case 'captions':
        content = [...mockAIResponses.captions].sort(() => 0.5 - Math.random()).slice(0, 3)
        break
      case 'hashtags':
        content = [...mockAIResponses.hashtags].sort(() => 0.5 - Math.random()).slice(0, 4)
        break
      case 'templates':
        content = [...mockAIResponses.templates].sort(() => 0.5 - Math.random()).slice(0, 3)
        break
    }
    
    setGeneratedContent(content)
    setIsGenerating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const shareContent = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'TelcoRewards Achievement',
        text: text
      })
    } else {
      copyToClipboard(text)
    }
  }

  const tabs = [
    { id: 'captions' as const, label: 'Captions', icon: MessageSquare },
    { id: 'hashtags' as const, label: 'Hashtags', icon: Hash },
    { id: 'templates' as const, label: 'Templates', icon: Wand2 }
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Sparkles className="text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
              <p className="text-sm text-slate-400">Generate social content</p>
            </div>
          </div>
          <button
            onClick={closeAIModal}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Activity Context */}
        {state.currentActivity && (
          <div className="p-4 bg-slate-700/50 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{state.currentActivity.icon}</span>
              <div>
                <p className="font-medium text-white">{state.currentActivity.title}</p>
                <p className="text-sm text-slate-400">+{state.currentActivity.tokens} tokens earned!</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setGeneratedContent([])
                }}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {generatedContent.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-4 bg-slate-700/50 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="text-indigo-400" size={32} />
              </div>
              <p className="text-slate-400 mb-4">
                Generate AI-powered {activeTab} for your achievement!
              </p>
              <button
                onClick={() => generateContent(activeTab)}
                disabled={isGenerating}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  `Generate ${activeTab}`
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedContent.map((content, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-white mb-3 leading-relaxed">{content}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(content)}
                      className="flex items-center space-x-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white transition-colors"
                    >
                      <Copy size={14} />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() => shareContent(content)}
                      className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm text-white transition-colors"
                    >
                      <Share2 size={14} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => generateContent(activeTab)}
                disabled={isGenerating}
                className="w-full py-3 border border-slate-600 hover:bg-slate-700/50 text-slate-300 rounded-lg font-medium transition-colors"
              >
                Generate More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}