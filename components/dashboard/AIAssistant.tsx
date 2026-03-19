import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, User, Bot, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HOSPITALS } from "../../lib/mockData";


interface Message {
    id: number;
    role: "user" | "bot";
    text: string;
    timestamp: string;
    recommendations?: any[];
    options?: string[];
}

const AIAssistant = () => {
    const navigate = useNavigate();

    // Initialize OpenAI API

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "bot",
            text: "Hello! I am your AI Health Assistant. How are you feeling today?",
            timestamp: "09:00 AM",
        },
    ]);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const suggestions = [
        "Chest pain",
        "Severe headache",
        "Fever & Chills",
        "Dental issue",
        "Eye problem",
        "Bone fracture",
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now(),
            role: "user",
            text,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
            
            const response = await fetch(`${apiBaseUrl}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                    history: messages
                        .filter((m, index) => !(index === 0 && m.role === "bot"))
                        .map(m => ({
                            role: m.role === "user" ? "user" : "assistant",
                            content: m.text
                        }))
                })
            });

            if (!response.ok) {
                throw new Error("AI Assistant is currently unavailable. Please try again later.");
            }

            const data = await response.json();
            const rawText = data.reply;

            // Extract options if present
            let botText = rawText;
            let options: string[] | undefined;
            const optionsMatch = rawText.match(/\[OPTIONS:\s*(.*?)\]/i);
            
            if (optionsMatch) {
                options = optionsMatch[1].split(",").map((s: string) => s.trim());
                botText = rawText.replace(/\[OPTIONS:.*?\]/i, "").trim();
            }

            let recommendations: any[] = [];
            const search = (text + botText).toLowerCase();

            // Smart recommendations based on keywords
            if (botText.length > 50 || search.includes("consult") || search.includes("hospital") || search.includes("doctor")) {
                if (search.includes("chest") || search.includes("heart")) {
                    recommendations = HOSPITALS.filter((h) =>
                        h.services.some(s => s.toLowerCase().includes("cardiac") || s.toLowerCase().includes("heart"))
                    ).slice(0, 2);
                } else if (search.includes("head") || search.includes("brain") || search.includes("neurology")) {
                    recommendations = HOSPITALS.filter((h) =>
                        h.services.some(s => s.toLowerCase().includes("mri") || s.toLowerCase().includes("neuro"))
                    ).slice(0, 2);
                } else if (search.includes("fever") || search.includes("flu") || search.includes("cold")) {
                    recommendations = HOSPITALS.filter((h) =>
                        h.services.some(s => s.toLowerCase().includes("emergency") || s.toLowerCase().includes("general"))
                    ).slice(0, 2);
                }
            }

            const botMsg: Message = {
                id: Date.now() + 1,
                role: "bot",
                text: botText,
                options,
                recommendations,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (err: any) {
            console.error("AI Proxy Error:", err);
            const botMsg: Message = {
                id: Date.now() + 1,
                role: "bot",
                text: "I am having trouble connecting right now. Please consult a doctor for any urgent concerns. (Fallback: AI Proxy Offline)",
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, botMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">

            <div className="px-10 py-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black">AI Health Assistant</h2>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-10 py-8 space-y-8">

                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`flex gap-4 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                                {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
                            </div>

                            <div>
                                <div
                                    className={`px-6 py-4 rounded-[2rem] text-sm font-bold ${msg.role === "user"
                                            ? "bg-sky-600 text-white"
                                            : "bg-slate-50 text-slate-700 border"
                                        }`}
                                >
                                    {msg.text}
                                </div>

                                {msg.options && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {msg.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(opt)}
                                                className="px-4 py-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 text-xs font-bold hover:bg-sky-100 transition-colors"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {msg.recommendations &&
                                    msg.recommendations.map((h: any) => (
                                        <div
                                            key={h.id}
                                            className="mt-3 p-4 rounded-2xl border flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="text-sm font-bold">{h.name}</p>
                                                <p className="text-xs text-slate-400">{h.address}</p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    navigate(`/dashboard/hospitals/${h.id}`)
                                                }
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    ))}

                                <span className="text-[10px] text-slate-400">
                                    {msg.timestamp}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-2 text-sm">
                        <Loader2 className="animate-spin" size={16} />
                        AI analyzing symptoms...
                    </div>
                )}
            </div>

            <div className="p-8 border-t space-y-4">

                <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleSend(s)}
                            className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold"
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="relative flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend(input);
                        }}
                        placeholder="Describe your symptoms..."
                        className="flex-1 pl-6 pr-16 py-5 rounded-[2rem] bg-slate-50 border"
                    />

                    <button
                        onClick={() => handleSend(input)}
                        className="absolute right-4 p-3 rounded-2xl bg-sky-600 text-white"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
