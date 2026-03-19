
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const testimonials = [
    {
        name: "Priya Sharma", role: "Working Professional",
        text: "HealthConnect saved me hours of searching. I found a specialist near my office and booked in under 2 minutes. Absolutely seamless!",
        rating: 5, avatar: "PS", color: "from-pink-400 to-rose-500",
    },
    {
        name: "Rahul Mehta", role: "Parent of 2",
        text: "The transparent pricing feature is a game-changer. No more surprise bills. I know exactly what I'm paying before I even walk in.",
        rating: 5, avatar: "RM", color: "from-sky-400 to-blue-500",
    },
    {
        name: "Dr. Ananya Roy", role: "Retired Teacher",
        text: "The AI assistant helped me understand my symptoms and pointed me to the right specialist. It was like having a doctor available all night.",
        rating: 5, avatar: "AR", color: "from-violet-400 to-purple-500",
    },
];

export default function Testimonials() {
    return (
        <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="py-32 bg-white"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.span variants={fadeUp} className="text-sky-500 font-semibold text-sm uppercase tracking-widest">Testimonials</motion.span>
                    <motion.h2 variants={fadeUp} transition={{ delay: 0.1 }} className="text-4xl font-bold text-slate-900 mt-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Loved by Patients Everywhere
                    </motion.h2>
                </div>

                <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            variants={fadeUp}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.03, translateY: -4 }}
                            className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 flex flex-col gap-4 cursor-default"
                        >
                            <div className="flex gap-1">
                                {Array(t.rating).fill(0).map((_, j) => (
                                    <Star key={j} size={16} className="text-amber-400" fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm flex-1">"{t.text}"</p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                                    <p className="text-slate-400 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
