
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppointments } from '../../lib/AppointmentContext';

const Appointments = () => {
    const { appointments, cancelAppointment } = useAppointments();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const filteredAppointments = appointments.filter(app => {
        if (activeTab === 'upcoming') return app.status === 'Confirmed';
        return app.status === 'Completed' || app.status === 'Cancelled';
    });

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Appointments</h1>
                <p className="text-slate-500 font-medium">Manage your scheduled visits and medical history.</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1.5 bg-slate-100 rounded-[2rem] w-fit">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'upcoming'
                            ? 'bg-white text-sky-600 shadow-xl shadow-sky-900/5'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'past'
                            ? 'bg-white text-sky-600 shadow-xl shadow-sky-900/5'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Past Records
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((app, i) => (
                            <motion.div
                                key={app.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-sky-900/5 transition-all relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest ${app.status === 'Confirmed' ? 'bg-sky-100 text-sky-600' :
                                        app.status === 'Completed' ? 'bg-teal-100 text-teal-600' : 'bg-rose-100 text-rose-600'
                                    }`}>
                                    {app.status}
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                                        <Calendar size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">{app.hospitalName}</h3>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px] uppercase tracking-wider mt-1">
                                            <User size={12} className="text-sky-500" /> {app.doctorName} • {app.specialization}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                                <Calendar size={14} className="text-sky-500" />
                                                <span className="text-xs font-black text-slate-700">{app.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                                <Clock size={14} className="text-teal-500" />
                                                <span className="text-xs font-black text-slate-700">{app.time}</span>
                                            </div>
                                        </div>

                                        {app.status === 'Confirmed' && (
                                            <div className="mt-8 flex gap-3">
                                                <button
                                                    onClick={() => cancelAppointment(app.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all"
                                                >
                                                    <XCircle size={14} /> Cancel
                                                </button>
                                                <button className="flex-1 py-3 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg active:scale-95">
                                                    Reschedule
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-24 text-center space-y-4"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                <AlertCircle size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No {activeTab} appointments found</h3>
                            <p className="text-slate-500 font-medium">Your medical schedule will appear here.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Appointments;
