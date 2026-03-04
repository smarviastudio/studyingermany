'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Brain, User, Sparkles, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';

interface ProfileData {
  degree_level: string;
  subject_areas: string[];
  language_preference: string;
  german_level: string;
  budget_max: number | null;
  preferred_cities: string[];
  intake_preference: string;
  timeline: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  programs?: any[];
}

interface ConsultationInterfaceProps {
  userProfile: ProfileData | null;
  onClose: () => void;
}

export function ConsultationInterface({ userProfile, onClose }: ConsultationInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedPrograms, setRecommendedPrograms] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize conversation
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: userProfile 
        ? `Hello! I'm your AI study consultant. I see you're interested in ${userProfile.degree_level} programs in ${userProfile.subject_areas.join(', ')}. Let me help you find the perfect program in Germany. What specific questions do you have about studying there?`
        : `Hello! I'm your AI study consultant. I'm here to help you find the perfect study program in Germany. To get started, could you tell me what you're looking to study and what level of degree you're pursuing?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [userProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response - in real implementation, this would call your AI API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on your question about "${inputValue}", I can help you with that. Here are some key points to consider when studying in Germany...`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Simulate program recommendations
      if (inputValue.toLowerCase().includes('program') || inputValue.toLowerCase().includes('course')) {
        setRecommendedPrograms([
          {
            id: '1',
            name: 'Computer Science MSc',
            university: 'TU Munich',
            city: 'Munich',
            tuition: 'Free',
            match: 95
          },
          {
            id: '2',
            name: 'Data Science MSc',
            university: 'University of Berlin',
            city: 'Berlin',
            tuition: '€3,000/year',
            match: 88
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="h-full flex">
        {/* Chat Panel */}
        <div className="flex-1 bg-slate-900 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Consultant</h2>
                <p className="text-sm text-gray-400">Your personal study advisor</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`flex-1 max-w-2xl ${
                  message.role === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-12'
                      : 'bg-white/5 text-white border border-white/10 mr-12'
                  }`}>
                    <p className="leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mr-12">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/10">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about studying in Germany..."
                className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations Panel */}
        <div className="w-96 bg-slate-800 border-l border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Recommendations</h3>
            <p className="text-sm text-gray-400">Programs that match your profile</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {recommendedPrograms.length > 0 ? (
              <div className="space-y-4">
                {recommendedPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-green-400">
                        {program.match}% Match
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <h4 className="font-semibold text-white mb-1">{program.name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{program.university}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{program.city}</span>
                      <span className="text-blue-400 font-medium">{program.tuition}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No recommendations yet</p>
                <p className="text-sm text-gray-500">Ask about programs to see suggestions</p>
              </div>
            )}
          </div>

          {userProfile && (
            <div className="p-6 border-t border-white/10">
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="font-medium text-white mb-3">Your Profile</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Degree:</span>
                    <span className="text-white capitalize">{userProfile.degree_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subjects:</span>
                    <span className="text-white text-right">{userProfile.subject_areas.slice(0, 2).join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Language:</span>
                    <span className="text-white capitalize">{userProfile.language_preference}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
