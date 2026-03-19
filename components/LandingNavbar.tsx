import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cross, Menu, X } from "lucide-react";
import { authService } from "../services/auth";

export default function LandingNavbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", h);

        authService.getSession().then((session) => {
            setSession(session);
        });

        const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            window.removeEventListener("scroll", h);
            subscription.unsubscribe();
        };
    }, []);

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-medical-blue to-medical-green flex items-center justify-center">
                        <Cross size={18} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Healthcare<span className="text-medical-blue"> Hub</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {["Home", "Services", "About", "Contact"].map(l => (
                        <a key={l} href="#" className="text-slate-600 hover:text-medical-blue font-medium transition-colors text-sm">
                            {l}
                        </a>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {session ? (
                        <Link to="/dashboard" className="px-6 py-2 rounded-full bg-gradient-to-r from-medical-blue to-medical-green text-white font-semibold text-sm shadow-lg shadow-medical-blue/20 hover:shadow-medical-blue/30 hover:scale-105 transition-all text-center">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" state={{ mode: 'login' }} className="px-5 py-2 rounded-full border-2 border-medical-blue text-medical-blue font-semibold text-sm hover:bg-medical-bg transition-all text-center">
                                Login
                            </Link>
                            <Link to="/login" state={{ mode: 'signup' }} className="px-5 py-2 rounded-full bg-gradient-to-r from-medical-blue to-medical-green text-white font-semibold text-sm shadow-lg shadow-medical-blue/20 hover:shadow-medical-blue/30 hover:scale-105 transition-all text-center">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-slate-700" onClick={() => setOpen(!open)}>
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4"
                    >
                        {["Home", "Services", "About", "Contact"].map(l => (
                            <a key={l} href="#" className="text-slate-700 font-medium">{l}</a>
                        ))}
                        <div className="flex gap-3 pt-2">
                            {session ? (
                                <Link to="/dashboard" onClick={() => setOpen(false)} className="flex-1 py-2 rounded-full bg-gradient-to-r from-medical-blue to-medical-green text-white font-semibold text-sm shadow-lg shadow-medical-blue/20 text-center">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" state={{ mode: 'login' }} onClick={() => setOpen(false)} className="flex-1 py-2 rounded-full border-2 border-medical-blue text-medical-blue font-semibold text-sm text-center">Login</Link>
                                    <Link to="/login" state={{ mode: 'signup' }} onClick={() => setOpen(false)} className="flex-1 py-2 rounded-full bg-gradient-to-r from-medical-blue to-medical-green text-white font-semibold text-sm text-center">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
