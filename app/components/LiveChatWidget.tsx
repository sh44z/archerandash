'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ChatMessage {
    sender: 'visitor' | 'agent';
    text: string;
    createdAt?: string;
    isRead?: boolean;
}

interface ChatThread {
    _id: string;
    visitorName: string;
    visitorEmail: string;
    status: 'new' | 'open' | 'resolved' | 'archived';
    messages: ChatMessage[];
}

export default function LiveChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusText, setStatusText] = useState('Leave a message and we will get back to you.');
    const [thread, setThread] = useState<ChatThread | null>(null);
    const [threadId, setThreadId] = useState<string | null>(null);
    const [presence, setPresence] = useState<'online' | 'offline'>('online');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const savedName = window.localStorage.getItem('live-chat-name') || '';
        const savedEmail = window.localStorage.getItem('live-chat-email') || '';
        const savedThreadId = window.localStorage.getItem('live-chat-thread-id') || '';
        setName(savedName);
        setEmail(savedEmail);
        if (savedThreadId) {
            setThreadId(savedThreadId);
        }
    }, []);

    useEffect(() => {
        const hour = new Date().getHours();
        setPresence(hour >= 9 && hour < 20 ? 'online' : 'offline');
    }, []);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const refreshThread = useCallback(async () => {
        if (!threadId) return;
        try {
            const res = await fetch(`/api/live-chat/${threadId}`);
            if (!res.ok) return;
            const data = await res.json();
            setThread(data.thread);
        } catch (error) {
            console.error('Failed to refresh live chat thread:', error);
        }
    }, [threadId]);

    useEffect(() => {
        if (!isOpen || !threadId) return;
        const interval = window.setInterval(() => {
            refreshThread();
        }, 4000);
        return () => window.clearInterval(interval);
    }, [isOpen, refreshThread, threadId]);

    const hasMessages = useMemo(() => (thread?.messages?.length || 0) > 0, [thread]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            setStatusText('Please provide your name, email, and a message.');
            return;
        }

        setIsSubmitting(true);
        setStatusText('Sending your message...');

        try {
            const res = await fetch('/api/live-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitorName: name, visitorEmail: email, message }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Could not send message.');
            }

            window.localStorage.setItem('live-chat-name', name);
            window.localStorage.setItem('live-chat-email', email);
            window.localStorage.setItem('live-chat-thread-id', data.thread._id);
            setThreadId(data.thread._id);
            setThread(data.thread);
            setMessage('');
            setStatusText('Thanks! Your message has been sent. We will reply soon.');
        } catch (error: any) {
            setStatusText(error.message || 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed bottom-28 right-6 z-60 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2"
                aria-label="Open live chat"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.75.75 0 11-.75-.75.75.75 0 01.75.75zm4.125 0a.75.75 0 11-.75-.75.75.75 0 01.75.75zm4.125 0a.75.75 0 11-.75-.75.75.75 0 01.75.75zM4.5 5.25c0-1.035.84-1.875 1.875-1.875h11.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.035-.84 1.875-1.875 1.875H10.5l-3 3v-3h-1.125A1.875 1.875 0 014.5 15z" />
                </svg>
                <span className="font-medium">Live chat</span>
            </button>

            {isOpen && (
                <div className="fixed bottom-28 right-6 z-70 w-[92vw] max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                    <div className="bg-emerald-600 px-4 py-3 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Message us</p>
                                <p className="text-xs text-emerald-100 flex items-center gap-1">
                                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${presence === 'online' ? 'bg-green-300' : 'bg-amber-300'}`} />
                                    {presence === 'online' ? 'Online now' : 'Offline right now'}
                                </p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="rounded p-1 hover:bg-emerald-700" aria-label="Close live chat">
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-3 bg-gray-50 max-h-[70vh] overflow-y-auto">
                        <p className="text-sm text-gray-600">{statusText}</p>

                        {hasMessages && thread && (
                            <div className="space-y-2">
                                {thread.messages.map((msg, index) => (
                                    <div key={`${msg.sender}-${index}`} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${msg.sender === 'agent' ? 'bg-white border ml-auto text-gray-800' : 'bg-emerald-600 text-white'}`}>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-2">
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            <textarea ref={inputRef} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
                                {isSubmitting ? 'Sending...' : 'Send message'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
