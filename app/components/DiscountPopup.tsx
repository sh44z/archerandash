'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/context/CartContext';

interface Message {
    id: string;
    sender: 'agent' | 'user';
    text: string;
    isCode?: boolean;
}

interface PopupSettings {
    isEnabled: boolean;
    chatTitle: string;
    chatMessage: string;
    discountCode: string;
    successMessage: string;
    placeholderText: string;
    avatarUrl: string;
}

export default function DiscountPopup() {
    const { cartCount, cartActivityKey, applyDiscount, appliedDiscount } = useCart();
    const [settings, setSettings] = useState<PopupSettings | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [validatedDiscount, setValidatedDiscount] = useState<{ type: 'percentage' | 'fixed'; value: number } | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [shouldAutoOpen, setShouldAutoOpen] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/discount-codes/popup-settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                    
                    // Validate discount code details immediately if code is set
                    if (data.discountCode) {
                        const valRes = await fetch('/api/discount-codes/validate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ code: data.discountCode })
                        });
                        if (valRes.ok) {
                            const valData = await valRes.json();
                            if (valData.valid) {
                                setValidatedDiscount({
                                    type: valData.discountType,
                                    value: valData.discountValue
                                });
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load popup settings:', err);
            }
        };

        fetchSettings();

        // Check if user already completed subscription
        const interacted = localStorage.getItem('has_interacted_discount_popup');
        if (interacted === 'submitted') {
            setIsSubmitted(true);
        }
    }, []);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const triggerChatSequence = useCallback(() => {
        setIsOpen(true);
        setIsMinimized(false);
        setIsTyping(true);
        setMessages([]);

        // Simulated natural typing delay
        setTimeout(() => {
            setIsTyping(false);
            setMessages([
                {
                    id: 'msg-1',
                    sender: 'agent',
                    text: settings?.chatMessage || 'Hey there! Enter your email below to get a 15% discount code instantly!'
                }
            ]);
        }, 1200);
    }, [settings]);

    useEffect(() => {
        if (!settings || !settings.isEnabled || isSubmitted || !shouldAutoOpen || isOpen) return;
        if (cartActivityKey > 0) {
            setShouldAutoOpen(false);
            triggerChatSequence();
        }
    }, [cartActivityKey, settings, isSubmitted, isOpen, shouldAutoOpen, triggerChatSequence]);

    const handleSubmitEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setErrorMsg('Please enter a valid email address.');
            return;
        }

        setErrorMsg('');
        setIsSubmitting(true);

        try {
            // 1. Submit email to subscriptions API
            const res = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to subscribe.');
            }

            // Add user's email as a message in the thread
            const userMsgId = `user-${Date.now()}`;
            setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: email }]);
            setIsSubmitting(false);
            setEmail('');
            
            // 2. Show agent typing then code response
            setIsTyping(true);
            
            setTimeout(() => {
                setIsTyping(false);
                setIsSubmitted(true);
                localStorage.setItem('has_interacted_discount_popup', 'submitted');
                
                setMessages(prev => [
                    ...prev,
                    {
                        id: `agent-success-${Date.now()}`,
                        sender: 'agent',
                        text: settings?.successMessage || `Awesome! Use your code at checkout for 15% off.`
                    },
                    {
                        id: `agent-code-${Date.now()}`,
                        sender: 'agent',
                        text: settings?.discountCode || 'WELCOME15',
                        isCode: true
                    }
                ]);
            }, 1500);

        } catch (err: any) {
            console.error('Subscription error:', err);
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleCopyCode = () => {
        if (!settings?.discountCode) return;
        navigator.clipboard.writeText(settings.discountCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleApplyDiscount = () => {
        if (!settings?.discountCode || !validatedDiscount) return;
        applyDiscount(settings.discountCode, validatedDiscount.type, validatedDiscount.value);
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(false);
        setIsSubmitted(false);
        setEmail('');
        setErrorMsg('');
        setIsTyping(false);
        setMessages([]);
        setShouldAutoOpen(true);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('has_interacted_discount_popup');
        }
    };

    if (!settings || !settings.isEnabled) return null;
    if (cartCount === 0 && !isOpen && !isSubmitted) return null;

    // Render launcher button if pop-up is not open but can be re-opened manually, or if minimized
    if (!isOpen || isMinimized) {

        return (
            <button
                onClick={() => {
                    setIsOpen(true);
                    setIsMinimized(false);
                    if (messages.length === 0) {
                        triggerChatSequence();
                    }
                }}
                className="fixed bottom-6 right-6 z-[60] bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group focus:outline-none"
                aria-label="Open Discount Chat"
            >
                <div className="relative">
                    {/* Notification Ping */}
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-white"></span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                </div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-[60] w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 animate-slide-up focus:outline-none">
            {/* Header */}
            <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between text-white shadow-md">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img 
                            src={settings.avatarUrl || '/images/logo.jpg'} 
                            alt="Agent Avatar" 
                            className="w-10 h-10 rounded-full object-cover border border-indigo-400 bg-white"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120';
                            }}
                        />
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-indigo-600 animate-pulse"></span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm leading-tight">{settings.chatTitle}</h3>
                        <p className="text-xs text-indigo-100 flex items-center gap-1">
                            Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsMinimized(true)}
                        className="p-1 hover:bg-indigo-700 rounded-md transition-colors text-indigo-100 hover:text-white"
                        title="Minimize"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                    </button>
                    <button 
                        onClick={handleClose}
                        className="p-1 hover:bg-indigo-700 rounded-md transition-colors text-indigo-100 hover:text-white"
                        title="Close chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col gap-3 scrollbar-thin">
                {messages.map((msg) => {
                    const isAgent = msg.sender === 'agent';
                    if (msg.isCode) {
                        return (
                            <div key={msg.id} className="flex flex-col gap-2 items-start max-w-[85%] self-start animate-fade-in">
                                <div className="bg-white border-2 border-dashed border-indigo-300 rounded-xl p-4 shadow-sm w-full flex flex-col items-center gap-3">
                                    <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Your Code</div>
                                    <div className="text-xl font-extrabold text-indigo-600 select-all tracking-wider font-mono">
                                        {msg.text}
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <button
                                            onClick={handleCopyCode}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                                        >
                                            {isCopied ? 'Copied!' : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m9.9-3.6h-7.8c-.621 0-1.125.504-1.125 1.125v13.5c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                        {validatedDiscount && (
                                            <button
                                                onClick={handleApplyDiscount}
                                                disabled={appliedDiscount?.code === msg.text}
                                                className={`flex-1 text-white py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                                                    appliedDiscount?.code === msg.text 
                                                        ? 'bg-green-600 cursor-default' 
                                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                                }`}
                                            >
                                                {appliedDiscount?.code === msg.text ? 'Applied ✓' : 'Apply'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-2 max-w-[80%] ${isAgent ? 'self-start' : 'self-end flex-row-reverse'} animate-fade-in`}
                        >
                            {isAgent && (
                                <img 
                                    src={settings.avatarUrl || '/images/logo.jpg'} 
                                    alt="" 
                                    className="w-7 h-7 rounded-full object-cover self-end flex-shrink-0"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120';
                                    }}
                                />
                            )}
                            <div
                                className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    isAgent
                                        ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                        : 'bg-indigo-600 text-white rounded-br-none'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex gap-2 max-w-[80%] self-start animate-pulse">
                        <img 
                            src={settings.avatarUrl || '/images/logo.jpg'} 
                            alt="" 
                            className="w-7 h-7 rounded-full object-cover self-end"
                        />
                        <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-gray-100 bg-white">
                {isSubmitted ? (
                    <div className="text-center text-xs text-green-600 font-semibold py-1">
                        Discount code unlocked! 🎉
                    </div>
                ) : (
                    <form onSubmit={handleSubmitEmail} className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                placeholder={settings.placeholderText || 'Enter your email...'}
                                required
                                className="w-full text-sm pl-3 pr-2 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 border-gray-200 text-gray-800 disabled:opacity-50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !email}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all duration-200 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:hover:bg-indigo-600"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            )}
                        </button>
                    </form>
                )}
                {errorMsg && (
                    <div className="text-red-500 text-xs mt-1.5 px-1 font-medium">
                        {errorMsg}
                    </div>
                )}
            </div>
        </div>
    );
}
