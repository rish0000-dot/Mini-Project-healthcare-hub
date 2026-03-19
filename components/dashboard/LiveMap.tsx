import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { USER_LOCATION } from '../../lib/mockData';
import { MapPin, Navigation, Building2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const DEFAULT_HOSPITAL_IMAGE = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '2rem'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  styles: [
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "transit",
      "stylers": [{ "visibility": "off" }]
    }
  ]
};

interface LiveMapProps {
  initialHospitals?: any[];
  initialLocation?: { lat: number; lng: number };
  searchKeyword?: string;
}

const LiveMap = ({ initialHospitals, initialLocation, searchKeyword }: LiveMapProps) => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState(initialLocation || USER_LOCATION);
  const [realHospitals, setRealHospitals] = useState<any[]>(initialHospitals || []);
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [hasCenteredOnce, setHasCenteredOnce] = useState(false);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && isLoaded && (!initialHospitals || initialHospitals.length === 0)) {
      console.log("LiveMap fetching hospitals...");
      const service = new google.maps.places.PlacesService(map);
      
      const handleResults = (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
        console.log("LiveMap Places API Status:", status);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setRealHospitals(results);
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setRealHospitals([]);
        } else {
          console.error("LiveMap Places API error:", status);
        }
      };

      if (searchKeyword) {
          console.log("LiveMap searching keyword:", searchKeyword);
          
          // Tier 1: Nearby Search with Keyword
          const nearbyRequest: google.maps.places.PlaceSearchRequest = {
            location: currentPosition,
            radius: 50000,
            keyword: searchKeyword,
          };

          service.nearbySearch(nearbyRequest, (results, status) => {
              console.log("LiveMap NearbySearch status:", status);
              if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                  handleResults(results, status);
              } else {
                  // Tier 2: Text Search Fallback
                  console.log("LiveMap fallback to textSearch...");
                  const textRequest: google.maps.places.TextSearchRequest = {
                    location: currentPosition,
                    radius: 50000,
                    query: searchKeyword,
                  };
                  service.textSearch(textRequest, (textResults, textStatus) => {
                      handleResults(textResults, textStatus);
                  });
              }
          });
      } else {
          const request: google.maps.places.PlaceSearchRequest = {
            location: currentPosition,
            radius: 50000,
            type: 'hospital'
          };
          service.nearbySearch(request, handleResults);
      }
    }
  }, [map, isLoaded, currentPosition, initialHospitals, searchKeyword]);

  useEffect(() => {
    if ("geolocation" in navigator && !initialLocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(newPos);
          // Only pan to center if map is loaded and it's the first time
          if (map && !hasCenteredOnce) {
            map.panTo(newPos);
            setHasCenteredOnce(true);
          }
        },
        (error) => {
          console.error("Error fetching location in LiveMap:", error);
          // Fallback to Mathura if GPS fails during watch
          if (!hasCenteredOnce) {
            setCurrentPosition({ lat: 27.4924, lng: 77.6737 });
            setHasCenteredOnce(true);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      setWatchId(id);
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [map, watchId]);

  const centerToMyCity = () => {
    if (map) {
      map.panTo(currentPosition);
      map.setZoom(14);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] bg-slate-100 rounded-[2.5rem] flex items-center justify-center border border-slate-200 animate-pulse">
        <div className="text-center">
          <MapPin className="mx-auto text-slate-300 mb-4 animate-bounce" size={48} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Live Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-sky-100/50">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* User Marker */}
        <Marker
          position={currentPosition}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#0ea5e9',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 8,
          }}
          title="Your Location"
        />

        {/* Real Hospital Markers */}
        {realHospitals.map((hospital) => (
          <Marker
            key={hospital.id || hospital.place_id}
            position={hospital.coordinates || hospital.geometry.location}
            onClick={() => setSelectedHospital(hospital)}
            icon={{
                url: hospital.id?.includes('mathura') || hospital.id?.includes('hosp') 
                    ? 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png' 
                    : 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', // Could use different icon for verified
                scaledSize: new google.maps.Size(40, 40)
            }}
          />
        ))}

        {selectedHospital && (
          <InfoWindow
            position={selectedHospital.coordinates || selectedHospital.geometry.location}
            onCloseClick={() => setSelectedHospital(null)}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-black text-slate-900 text-sm mb-1">{selectedHospital.name}</h3>
              <p className="text-[10px] text-slate-500 mb-2 truncate">{selectedHospital.vicinity || selectedHospital.address}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="fill-amber-400 text-amber-400" size={10} />
                  <span className="text-[10px] font-bold">{selectedHospital.rating || "N/A"}</span>
                </div>
                <span className="text-sky-600 font-black text-[10px]">{selectedHospital.verified ? 'Verified Partner' : 'Near You'}</span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map UI Overlay */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/20 pointer-events-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-xs font-black text-slate-900">Live Tracking Active</span>
          </div>
        </div>

        <button
          onClick={centerToMyCity}
          className="bg-white hover:bg-slate-50 text-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-100 transition-all active:scale-95 pointer-events-auto group"
          title="Recenter to my location"
        >
          <Navigation size={20} className="text-sky-500 group-hover:rotate-45 transition-transform" />
        </button>
      </div>

      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-8 left-8 right-8 bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex items-center gap-6 z-[100]"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
              <img 
                  src={selectedHospital.image || (selectedHospital.photos && selectedHospital.photos.length > 0 ? (typeof selectedHospital.photos[0].getUrl === 'function' ? selectedHospital.photos[0].getUrl() : selectedHospital.photos[0]) : DEFAULT_HOSPITAL_IMAGE)} 
                  className="w-full h-full object-cover" 
                  alt={selectedHospital.name} 
                  onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_HOSPITAL_IMAGE;
                  }}
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-black text-slate-900 mb-1">{selectedHospital.name}</h4>
              <div className="flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5"><Building2 size={12} className="text-sky-500" /> {(selectedHospital.types || selectedHospital.services)?.[0]?.replace('_', ' ')}</span>
                <span className="flex items-center gap-1.5"><Star size={12} className="text-amber-400 fill-amber-400" /> {selectedHospital.rating} Rating</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate(`/dashboard/hospitals/${selectedHospital.id || selectedHospital.place_id}`)}
                    className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 transition-colors"
                >
                    View Details
                </button>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination_place_id=${selectedHospital.place_id || ''}&destination=${selectedHospital.address || ''}`, '_blank')}
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors border border-slate-100"
                >
                    <Navigation size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveMap;
