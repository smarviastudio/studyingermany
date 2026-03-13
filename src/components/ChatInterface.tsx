'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, ProgramSummary } from '@/lib/types';
import { ProfileSidebar } from './ProfileSidebar';
import { ProgramResults } from './ProgramResults';
import { ProgramModal } from './ProgramModal';

interface ChatInterfaceProps {
  sessionId: string;
}

export function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    target_subjects: [],
    preferred_language: 'either',
    preferred_cities: [],
    desired_intake: 'any'
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load existing conversation on mount
    loadConversation();
  }, [sessionId]);

  const loadConversation = async () => {
    try {
      const response = await fetch(`/api/chat?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.conversation || []);
        setUserProfile(data.user_profile || userProfile);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: currentMessage,
          user_profile: userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.assistant_message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setUserProfile(data.updated_profile);

      // If programs were referenced, fetch them
      if (data.referenced_program_ids && data.referenced_program_ids.length > 0) {
        await fetchPrograms(data.referenced_program_ids);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrograms = async (programIds: string[]) => {
    try {
      const programPromises = programIds.map(id =>
        fetch(`/api/programs/${id}`).then(res => res.json())
      );
      
      const programResponses = await Promise.all(programPromises);
      const fetchedPrograms = programResponses
        .filter(response => response.program)
        .map(response => ({
          id: response.program.id,
          program_name: response.program.program_name,
          university: response.program.university,
          city: response.program.city,
          degree_level: response.program.degree_level,
          subject_area: response.program.subject_area,
          tuition_fee_number: response.program.tuition_fee_number,
          tuition_fee_currency: response.program.tuition_fee_currency,
          tuition_eur_min: response.program.tuition_eur_min,
          tuition_eur_max: response.program.tuition_eur_max,
          tuition_exact_eur: response.program.tuition_exact_eur,
          is_free: response.program.is_free,
          beginning_normalized: response.program.beginning_normalized,
          quality_warnings: response.program.quality_warnings,
          image_url: response.program.image_url,
          detail_url: response.program.detail_url,
        }));
      
      setPrograms(fetchedPrograms);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Profile Sidebar */}
      <ProfileSidebar 
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        showDebug={showDebug}
        onToggleDebug={() => setShowDebug(!showDebug)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-900">
            DAAD AI Consultant
          </h1>
          <p className="text-sm text-gray-600">
            Find your perfect German academic program
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <h2 className="text-lg font-medium mb-2">Welcome! 👋</h2>
              <p>I'm here to help you find the perfect German academic program.</p>
              <p className="mt-2">Tell me about your interests and goals to get started!</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about German academic programs..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      {programs.length > 0 && (
        <ProgramResults
          programs={programs}
          onSelectProgram={setSelectedProgram}
        />
      )}

      {/* Program Detail Modal */}
      {selectedProgram && (
        <ProgramModal
          programId={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
}
