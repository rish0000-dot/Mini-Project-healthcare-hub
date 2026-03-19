
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Phone, Clock, Star, CheckCircle2,
    MessageCircle, ChevronRight, ExternalLink, MapPin
} from 'lucide-react';
import { HOSPITALS, DOCTORS } from '../../lib/mockData';
import { REAL_HOSPITALS } from '../../lib/realHospitalData';
import BookingModal from './BookingModal';
import { useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];
const DEFAULT_HOSPITAL_IMAGE = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000';

const HospitalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES
    });

    React.useEffect(() => {
        if (isLoaded && id) {
            // Check if it's a researched or mock hospital first
            const combinedBase = [...REAL_HOSPITALS, ...HOSPITALS];
            const baseHospital = combinedBase.find(h => h.id === id);
            
            if (baseHospital) {
                setHospital(baseHospital);
                setIsLoading(false);
                return;
            }

            // Otherwise, fetch from Google Places
            const dummyMap = new google.maps.Map(document.createElement('div'));
            const service = new google.maps.places.PlacesService(dummyMap);
            
            service.getDetails({
                placeId: id,
                fields: ['name', 'rating', 'formatted_address', 'formatted_phone_number', 'photos', 'opening_hours', 'reviews', 'types', 'geometry', 'vicinity']
            }, (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                    setHospital(result);
                }
                setIsLoading(false);
            });
        }
    }, [isLoaded, id]);

    if (isLoading) return <div className="p-20 text-center font-bold animate-pulse text-slate-400">Loading Details...</div>;
    if (!hospital) return <div className="p-20 text-center font-bold">Hospital not found</div>;

    // Filter doctors - if real hospital, show all doctors as "available at this location"
    const hospitalDoctors = hospital.id ? DOCTORS.filter(d => d.hospitalId === hospital.id) : DOCTORS;

    return (
        <div className="pb-20">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard/hospitals')}
                className="mb-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-sky-500 hover:text-sky-600 transition-all shadow-sm"
            >
                <ArrowLeft size={16} /> Back to Search
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Info & Services */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Header Card */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-sky-900/5 overflow-hidden">
                         <div className="relative h-72 bg-slate-100">
                            <img 
                                src={hospital.image || (hospital.photos && hospital.photos.length > 0 ? (typeof hospital.photos[0].getUrl === 'function' ? hospital.photos[0].getUrl() : hospital.photos[0]) : DEFAULT_HOSPITAL_IMAGE)} 
                                alt={hospital.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = DEFAULT_HOSPITAL_IMAGE;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-8 left-10 right-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 rounded-full bg-sky-500 text-white text-[10px] font-extrabold uppercase tracking-widest">Premium Facility</span>
                                    {hospital.verified && (
                                        <span className="px-3 py-1 rounded-full bg-teal-500 text-white text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                                            <CheckCircle2 size={10} /> Verified
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-4xl font-black text-white tracking-tight">{hospital.name}</h1>
                                <p className="text-white/80 font-medium mt-2 flex items-center gap-1.5 shadow-sm">
                                    <MapPin size={16} className="text-sky-400" /> {hospital.formatted_address || hospital.address || hospital.vicinity}
                                </p>
                            </div>
                        </div>

                        <div className="p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                                 <div className="flex items-center gap-1.5">
                                    <Star size={18} className="fill-amber-400 text-amber-400" />
                                    <span className="text-xl font-black text-slate-900">{hospital.rating || 'N/A'}</span>
                                    <span className="text-xs text-slate-400">({(hospital.reviews as any[])?.length || (hospital.reviews as number) || 0} reviews)</span>
                                </div>
                            </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operating Hours</p>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={18} className="text-sky-500" />
                                    <span className="text-sm font-bold text-slate-900">
                                        {hospital.opening_hours?.weekday_text?.[0] || 
                                         ((typeof hospital.opening_hours?.isOpen === 'function' && hospital.opening_hours.isOpen()) || hospital.verified || hospital.id?.includes('hosp') || hospital.id?.includes('mathura') ? 'Open Now' : 'Check Status') || 
                                         hospital.operatingHours || 
                                         'Available'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                                <div className="flex items-center gap-1.5">
                                    <Phone size={18} className="text-teal-500" />
                                    <span className="text-sm font-bold text-slate-900">{hospital.formatted_phone_number || hospital.phone || 'Available'}</span>
                                </div>
                            </div>
                            <div>
                                <button className="w-full h-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 font-bold text-xs uppercase transition-all hover:bg-sky-50 hover:border-sky-200">
                                    Directions <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                     {/* Services & Pricing Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Services & Pricing</h2>
                            <span className="px-4 py-2 rounded-xl bg-teal-50 text-teal-600 font-black text-[10px] uppercase tracking-widest border border-teal-100">
                                Best Rates Guaranteed
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            {(hospital.priceList) ? (
                                Object.entries(hospital.priceList).map(([service, price]) => (
                                    <div key={service} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-sky-50 hover:border-sky-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <CheckCircle2 size={18} className="text-sky-500" />
                                            </div>
                                            <span className="font-black text-slate-700 uppercase tracking-tight text-sm">{service}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Charge</p>
                                            <span className="font-black text-sky-600 text-xl">₹{price as number}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-wrap gap-4">
                                    {(hospital.types || hospital.services)?.map((type: string) => (
                                        <div key={type} className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 group hover:bg-sky-50 transition-all">
                                            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                                            <span className="font-bold text-slate-700 uppercase tracking-tight text-xs">{type.replace('_', ' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Doctors */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white">
                        <h2 className="text-xl font-black mb-6">Our Specialists</h2>
                        <div className="space-y-6">
                            {hospitalDoctors.map((doc) => (
                                <div key={doc.id} className="p-5 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-sky-500/30">
                                            <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm">{doc.name}</h4>
                                            <p className="text-[10px] text-sky-400 font-black uppercase tracking-widest">{doc.specialization}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-[10px]">
                                                <p className="text-white/40 font-bold uppercase tracking-tighter">Exp.</p>
                                                <p className="font-bold">{doc.experience}</p>
                                            </div>
                                            <div className="text-[10px]">
                                                <p className="text-white/40 font-bold uppercase tracking-tighter">Rating</p>
                                                <p className="font-bold flex items-center gap-1 text-amber-400">
                                                    <Star size={10} className="fill-amber-400" /> {doc.rating}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedDoctor(doc)}
                                            className="px-4 py-2.5 rounded-xl bg-sky-600 text-white font-black text-[10px] uppercase tracking-wider hover:bg-sky-500 transition-all shadow-lg shadow-sky-600/20 active:scale-95"
                                        >
                                            Book Appt.
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-4 rounded-2xl border-2 border-white/10 text-white/60 font-black text-xs uppercase tracking-widest hover:border-white/30 hover:text-white transition-all">
                            View All Staff
                        </button>
                    </div>

                    <div className="bg-sky-100 rounded-[2.5rem] p-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-6">
                            <MessageCircle size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 leading-tight">Need help choosing?</h3>
                        <p className="text-sky-700/70 text-sm font-medium mt-2 mb-6">Ask our AI Assistant for recommendations based on your symptoms.</p>
                        <button
                            onClick={() => navigate('/dashboard/ai-assistant')}
                            className="flex items-center gap-2 font-black text-sky-700 text-sm group"
                        >
                            Start Chat <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedDoctor && (
                    <BookingModal
                        doctor={selectedDoctor}
                        hospital={hospital}
                        onClose={() => setSelectedDoctor(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default HospitalDetail;
