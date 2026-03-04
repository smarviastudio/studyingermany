'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, ProgramSummary } from '@/lib/types';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { ProgramCard } from './ProgramCard';
import { ProgramModal } from './ProgramModal';

interface ModernChatInterfaceProps {
  sessionId: string;
  userProfile: UserProfile;
}

export function ModernChatInterface({ sessionId, userProfile }: ModernChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load existing conversation
    loadConversation();
    // Send initial greeting
    if (messages.length === 0) {
      sendInitialMessage();
    }
  }, [sessionId]);

  const loadConversation = async () => {
    try {
      const response = await fetch(`/api/chat?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.conversation || []);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const sendInitialMessage = async () => {
    const profileSummary = `I've completed my profile setup and I'm ready to see program recommendations! Here are my details:

**Degree Level:** ${userProfile.target_degree_level || 'Any level'}
**Subject Interests:** ${userProfile.target_subjects?.join(', ') || 'Open to various subjects'}
**Language Preference:** ${userProfile.preferred_language || 'Either English or German'}
**Preferred Cities:** ${userProfile.preferred_cities?.length ? userProfile.preferred_cities.join(', ') : 'Open to any city in Germany'}
**Budget:** ${userProfile.max_tuition_eur ? `Up to €${userProfile.max_tuition_eur} per year` : 'No specific budget limit'}
**Intake Timing:** ${userProfile.desired_intake || 'Any semester'}

Please search for relevant programs and provide detailed recommendations with explanations of why each program would be a great fit for my profile!`;
    
    await sendMessage(profileSummary, false);
  };

  const sendMessage = async (messageText?: string, showUserMessage = true) => {
    const textToSend = messageText || currentMessage;
    if (!textToSend.trim() || isLoading) return;

    if (showUserMessage) {
      const userMessage: ChatMessage = {
        role: 'user',
        content: textToSend,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
    }

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
          message: textToSend,
          user_profile: userProfile,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Invalid response format from server');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.assistant_message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If programs were referenced, fetch them
      if (data.referenced_program_ids && data.referenced_program_ids.length > 0) {
        await fetchPrograms(data.referenced_program_ids);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or check your OpenAI API key configuration.',
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
          beginning_normalized: response.program.beginning_normalized,
          quality_warnings: response.program.quality_warnings,
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

  const suggestedQuestions = [
    "Show me more programs in Berlin",
    "What are the cheapest options?",
    "Find programs starting in Winter 2024",
    "Tell me about application requirements"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            DAAD AI Consultant
          </h1>
          <p className="text-gray-600">
            Your personalized guide to German academic programs
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 inline-block mb-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Finding your perfect programs...
            </h2>
            <p className="text-gray-600">
              Analyzing your profile and searching the DAAD database
            </p>
          </div>
        )}

        {/* Welcome State */}
        {messages.length === 0 && !isLoading && programs.length === 0 && (
          <div className="text-center py-12 mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 inline-block mb-4">
              <Bot className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome! Let's find your perfect program
            </h2>
            <p className="text-gray-600 mb-6">
              I'll analyze your profile and suggest the best German academic programs for you.
            </p>
          </div>
        )}

        {/* Program Results */}
        {programs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Recommended Programs
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {programs.map((program, index) => (
                <ProgramCard
                  key={`${program.id}-${index}`}
                  program={program}
                  onClick={() => setSelectedProgram(program.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {messages.length > 0 && !isLoading && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question)}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-4">
          <div className="flex space-x-4">
            <textarea
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about German academic programs..."
              className="flex-1 resize-none border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-900 placeholder-gray-500"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!currentMessage.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

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
