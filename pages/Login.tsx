import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/auth';
import { Loader2, Heart, ArrowLeft, Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(""); // Renamed from 'error' for clarity
    const [mode, setMode] = useState<"login" | "signup">("login");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkUser = async () => {
            const session = await authService.getSession();
            if (session) navigate('/dashboard');
        };
        checkUser();
        
        if (location.state?.mode) {
            setMode(location.state.mode);
        }
    }, [navigate, location]);

    const handleGoogleLogin = async () => {
        try {
            setFeedback("");
            await authService.signInWithGoogle();
        } catch (err: any) {
            setFeedback(err.message || "Failed to log in with Google.");
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback("");

        try {
            if (mode === "login") {
                await authService.signIn(email, password);
                navigate('/login-success');
            } else {
                if (!firstName.trim() || !lastName.trim()) {
                    setFeedback("Please enter your full name.");
                    setLoading(false);
                    return;
                }
                if (!termsAccepted) {
                    setFeedback("You must agree to the terms and conditions.");
                    setLoading(false);
                    return;
                }
                const data = await authService.signUp(email, password, firstName, lastName);
                
                if (data?.session) {
                    navigate('/login-success');
                } else {
                    setFeedback("Account created! You can now log in.");
                    setMode("login");
                }
            }
        } catch (err: any) {
            let errorMessage = err.message || "An error occurred during authentication.";
            if (errorMessage.toLowerCase().includes("invalid login credentials")) {
                errorMessage = "Invalid email or password. Please try again or use Google if you signed up with it.";
            } else if (errorMessage.toLowerCase().includes("email not confirmed")) {
                errorMessage = "Please check your inbox and confirm your email address before logging in.";
            }
            setFeedback(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-jakarta">
            {/* Back Button */}
            <button 
                onClick={() => navigate('/')}
                className="fixed top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-medical-blue transition-all duration-200 group font-medium"
                disabled={loading}
            >
                <div className="p-2 rounded-full group-hover:bg-medical-blue/10 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                <span>Back Home</span>
            </button>

            <motion.div 
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="w-full max-w-[440px]"
            >
                <div className="bg-white rounded-3xl shadow-[0_10px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative">
                    {/* Top Decorative Bar */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-medical-blue to-cyan-400" />
                    
                    <div className="p-10">
                        <div className="text-center mb-10">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="w-14 h-14 bg-medical-blue/10 rounded-2xl flex items-center justify-center text-medical-blue mx-auto mb-5 shadow-sm"
                            >
                                <Heart size={28} fill="currentColor" fillOpacity={0.15} />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                                {mode === "login" ? "Welcome back" : "Create account"}
                            </h1>
                            <p className="text-slate-500 text-sm">
                                {mode === "login" ? "Enter your details to access your account" : "Get started with our medical services today"}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.form 
                                key={mode}
                                initial={{ opacity: 0, x: mode === "login" ? -10 : 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: mode === "login" ? 10 : -10 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleEmailAuth} 
                                className="space-y-6" 
                                autoComplete="off"
                            >
                                {feedback && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`p-4 rounded-xl text-sm font-medium border ${
                                            feedback.includes("created") ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                        }`}
                                    >
                                        <div className="flex gap-2">
                                            {feedback.includes("created") ? <CheckCircle2 size={18} /> : null}
                                            {feedback}
                                        </div>
                                    </motion.div>
                                )}

                                {mode === "signup" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-600 ml-1">First Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input 
                                                    type="text" 
                                                    required={mode === "signup"}
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-medical-blue focus:ring-[3px] focus:ring-medical-blue/10 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700 text-sm"
                                                    placeholder="First Name"
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-600 ml-1">Last Name</label>
                                            <input 
                                                type="text" 
                                                required={mode === "signup"}
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-medical-blue focus:ring-[3px] focus:ring-medical-blue/10 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700 text-sm"
                                                placeholder="Last Name"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-600 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-medical-blue focus:ring-[3px] focus:ring-medical-blue/10 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700 text-sm"
                                            placeholder="name@example.com"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-600 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="new-password"
                                            className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-medical-blue focus:ring-[3px] focus:ring-medical-blue/10 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700 text-sm"
                                            placeholder="••••••••"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-medical-blue transition-colors rounded-lg focus:outline-none"
                                            disabled={loading}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {mode === "signup" && (
                                    <div className="flex items-center gap-3 px-1">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                required={mode === "signup"}
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="peer w-5 h-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 checked:bg-medical-blue checked:border-medical-blue transition-all disabled:opacity-50"
                                                disabled={loading}
                                            />
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-current stroke-3 fill-none" viewBox="0 0 24 24">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <label htmlFor="terms" className="text-xs font-semibold text-slate-500 cursor-pointer select-none">
                                            I agree to the <span className="text-medical-blue hover:underline">Terms & Conditions</span>
                                        </label>
                                    </div>
                                )}

                                <button 
                                    disabled={loading}
                                    type="submit"
                                    className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-medical-blue transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,23,42,0.3)] disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : (mode === "login" ? "Sign In" : "Create Account")}
                                </button>
                            </motion.form>
                        </AnimatePresence>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-100"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-white text-slate-700 font-semibold text-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-70 transform active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-slate-500">{mode === "login" ? "New to Health Hub? " : "Already have an account? "}</span>
                            <button 
                                type="button"
                                onClick={() => {
                                    setMode(mode === "login" ? "signup" : "login");
                                    setFeedback("");
                                    setFirstName("");
                                    setLastName("");
                                    setTermsAccepted(false);
                                    setShowPassword(false);
                                }}
                                className="font-bold text-medical-blue hover:text-cyan-600 transition-colors"
                                disabled={loading}
                            >
                                {mode === "login" ? "Sign up now" : "Log in"}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Visual Accent */}
                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
                        Empowering Healthcare Through Technology
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
