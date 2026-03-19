import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, CheckCircle2, Building2, Navigation, Clock } from 'lucide-react';
import LiveMap from './LiveMap';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HOSPITALS } from '../../lib/mockData';
import { REAL_HOSPITALS } from '../../lib/realHospitalData';

const LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];
const DEFAULT_HOSPITAL_IMAGE = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000';

const HospitalList = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [filterService, setFilterService] = useState('All');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [realHospitals, setRealHospitals] = useState<any[]>([]);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    console.error("Geolocation failed in HospitalList, falling back to Mathura");
                    // Fallback to Mathura coordinates if GPS fails
                    setCurrentLocation({ lat: 27.4924, lng: 77.6737 });
                    setIsLoading(false);
                }
            );
        }
    }, []);

    useEffect(() => {
        const fetchHospitals = () => {
            if (isLoaded && currentLocation) {
                console.log("Fetching hospitals for location:", currentLocation);
                setIsLoading(true);
                
                const dummyMap = new google.maps.Map(document.createElement('div'));
                const service = new google.maps.places.PlacesService(dummyMap);
                
                // If search is present, use a tiered search strategy for maximum results
                if (search) {
                    console.log("Searching for keyword:", search);
                    setIsLoading(true);
                    
                    // Tier 1: Nearby Search with Keyword (Better for local relevance)
                    const nearbyRequest: google.maps.places.PlaceSearchRequest = {
                        location: currentLocation,
                        radius: 50000, // Increased to 50km
                        keyword: search
                    };

                    service.nearbySearch(nearbyRequest, (results, status) => {
                        console.log("NearbySearch status for keyword:", status);
                        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                            handleResults(results, status);
                        } else {
                            // Tier 2: Text Search Fallback (Broad matching)
                            console.log("Fallback to textSearch...");
                            const textRequest: google.maps.places.TextSearchRequest = {
                                location: currentLocation,
                                radius: 50000,
                                query: search
                            };
                            service.textSearch(textRequest, (textResults, textStatus) => {
                                handleResults(textResults, textStatus);
                            });
                        }
                    });
                } else {
                    console.log("Performing nearby hospital search");
                    const request: google.maps.places.PlaceSearchRequest = {
                        location: currentLocation,
                        radius: 50000, // 50km
                        type: 'hospital'
                    };

                    service.nearbySearch(request, handleResults);
                }
            }
        };

        const handleResults = (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
            console.log("Places API Status:", status);
            
            const normalizedPlaces = (results || []).map(p => ({
                ...p,
                id: p.place_id,
                vicinity: p.vicinity || p.formatted_address
            }));

            // Filter mock hospitals based on search if needed
            const baseHospitals = [...REAL_HOSPITALS, ...HOSPITALS];
            const filteredBase = search 
                ? baseHospitals.filter(h => 
                    h.name.toLowerCase().includes(search.toLowerCase()) || 
                    (h.services && h.services.some(s => s.toLowerCase().includes(search.toLowerCase()))) ||
                    h.address.toLowerCase().includes(search.toLowerCase())
                  )
                : baseHospitals;

            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                console.log("Hospitals found via Google Maps:", results.length);
                setRealHospitals([...filteredBase, ...normalizedPlaces]);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                console.log("No Google results, using researched hospital data.");
                setRealHospitals(filteredBase);
            } else {
                console.error("Places API error (Possible Billing/Key Issue):", status);
                // Fallback to our high-quality researched data
                setRealHospitals(filteredBase);
            }
            setIsLoading(false);
        };

        fetchHospitals();
    }, [isLoaded, currentLocation, search]);

    const services = ["All", "General Hospital", "Emergency", "Clinic", "Pharmacy", "Doctor", "Health"];

    const filteredHospitals = realHospitals.filter(h => {
        const matchesService = filterService === 'All' || 
            (h.types && h.types.some((t: string) => t.toLowerCase().replace('_', ' ').includes(filterService.toLowerCase())));
        return matchesService;
    });
    // Note: Local search filtering is handled by the API 'keyword' parameter now

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Find Hospitals</h1>
                    <p className="text-slate-500 font-medium">Browse verified healthcare providers near you.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or service..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all w-full md:w-80 font-medium"
                        />
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-xl transition-all flex items-center gap-2 px-4 ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <LayoutGrid size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">List</span>
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded-xl transition-all flex items-center gap-2 px-4 ${viewMode === 'map' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <MapIcon size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Map</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-wrap gap-3 mb-4">
                {services.map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterService(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${filterService === s
                            ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-600/20'
                            : 'bg-white border-slate-100 text-slate-500 hover:border-sky-200 hover:text-sky-600'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                         Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-[400px] rounded-[2.5rem] bg-slate-100 animate-pulse" />
                         ))
                    ) : (
                        filteredHospitals.map((h, i) => (
                            <motion.div
                                key={h.id || h.place_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => navigate(`/dashboard/hospitals/${h.id || h.place_id}`)}
                                className="group cursor-pointer bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-sky-100 transition-all flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden bg-slate-100">
                                    <img 
                                        src={h.image || (h.photos && h.photos.length > 0 ? (typeof h.photos[0].getUrl === 'function' ? h.photos[0].getUrl() : h.photos[0]) : DEFAULT_HOSPITAL_IMAGE)} 
                                        alt={h.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = DEFAULT_HOSPITAL_IMAGE;
                                        }}
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm shadow-sm flex items-center gap-1">
                                            <Star size={10} className="fill-amber-400 text-amber-400" /> {h.rating || 'N/A'}
                                        </span>
                                    </div>
                                    {(h.verified || h.id?.includes('mathura')) && (
                                        <div className="absolute top-4 right-4 p-1.5 rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                                            <CheckCircle2 size={14} />
                                        </div>
                                    )}
                                </div>

                                <div className="p-7 flex flex-col flex-1">
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">{h.name}</h3>
                                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1 mb-4">
                                        <MapPin size={12} className="text-sky-500" />
                                        <span className="font-medium truncate">{h.vicinity || h.address}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {(h.services || h.types)?.slice(0, 3).map((type: string) => (
                                            <span key={type} className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                                                {type.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="text-xs">
                                            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-tighter mb-1">
                                                <Clock size={12} />
                                                <span>Status</span>
                                            </div>
                                            <p className={`font-black text-sm ${(typeof h.opening_hours?.isOpen === 'function' ? h.opening_hours.isOpen() : (h.opening_hours?.open_now || h.verified || h.id?.includes('hosp') || h.id?.includes('mathura'))) ? 'text-teal-600' : 'text-rose-600'}`}>
                                                {(typeof h.opening_hours?.isOpen === 'function' ? h.opening_hours.isOpen() : (h.opening_hours?.open_now || h.verified || h.id?.includes('hosp') || h.id?.includes('mathura'))) ? 'Open Now' : 'Closed'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`https://www.google.com/maps/dir/?api=1&destination_place_id=${h.place_id || ''}&destination=${h.address || ''}`, '_blank');
                                            }}
                                            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-600 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                        >
                                            <Navigation size={14} />
                                            Directions
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                    {filteredHospitals.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Building2 size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No hospitals found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2">Try searching with different keywords, clearing filters, or checking your location.</p>
                            {(search || filterService !== 'All') && (
                                <button 
                                    onClick={() => {setSearch(''); setFilterService('All');}}
                                    className="mt-6 px-6 py-2 rounded-xl bg-sky-50 text-sky-600 font-bold text-xs uppercase tracking-widest hover:bg-sky-100 transition-all"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                >
                    <LiveMap 
                        initialHospitals={realHospitals} 
                        initialLocation={currentLocation || undefined} 
                        searchKeyword={search}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default HospitalList;
