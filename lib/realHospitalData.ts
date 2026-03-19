export interface Hospital {
    id: string;
    place_id?: string;
    name: string;
    image: string;
    address: string;
    coordinates: { lat: number; lng: number };
    rating: number;
    reviews: number;
    verified: boolean;
    distance?: string;
    priceRange: string;
    services: string[];
    priceList?: { [key: string]: number };
    operatingHours: string;
    phone: string;
    specialties: string[];
}

export const REAL_HOSPITALS: Hospital[] = [
    {
        id: 'nayati-medicity',
        name: 'Nayati Medicity',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000&sig=nayati_v2',
        address: 'NH 19, Goverdhan Bypass, Mathura',
        coordinates: { lat: 27.5615, lng: 77.6235 },
        rating: 4.9,
        reviews: 2450,
        verified: true,
        priceRange: '₹₹₹',
        services: ["Emergency", "ICU", "Cardiology", "Neurology", "Transplant"],
        operatingHours: "24/7",
        phone: "+91 565 2417000",
        specialties: ['Cardiology', 'Neurology', 'Oncology']
    },
    {
        id: 'kd-medical-college',
        name: 'K.D. Medical College & Hospital',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1000&sig=kd_v2',
        address: 'NH-2, Akbarpur, Mathura',
        coordinates: { lat: 27.6495, lng: 77.5510 },
        rating: 4.7,
        reviews: 1800,
        verified: true,
        priceRange: '₹₹',
        services: ["Emergency", "OPD", "Diagnostics", "Surgery"],
        operatingHours: "24/7",
        phone: "+91 565 2402000",
        specialties: ['General Medicine', 'Surgery', 'Pediatrics']
    },
    {
        id: 'gopi-krishna-hosp',
        name: 'Gopi Krishna Hospital',
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000&sig=gopi',
        address: 'Sadar Bazar, Mathura',
        coordinates: { lat: 27.4969, lng: 77.6902 },
        rating: 4.0,
        reviews: 950,
        verified: true,
        priceRange: '₹₹',
        services: ["Emergency", "ICU", "Maternity"],
        operatingHours: "24/7",
        phone: "+91 9897033333",
        specialties: ['Cardiology', 'Obstetrics']
    },
    {
        id: 'bhaskar-super-speciality',
        name: 'Bhaskar Super Speciality Hospital',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1000&sig=bhaskar',
        address: 'Madhavpuri, Mathura',
        coordinates: { lat: 27.4820, lng: 77.6573 },
        rating: 4.8,
        reviews: 620,
        verified: true,
        priceRange: '₹₹',
        services: ["Dialysis", "Neurology", "Emergency"],
        operatingHours: "24/7",
        phone: "+91 9837842653",
        specialties: ['Nephrology', 'Neurology']
    },
    {
        id: 'agra-city-hosp',
        name: 'Agra City Hospital',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000&sig=agra',
        address: 'MG Road, Agra (~50km radius)',
        coordinates: { lat: 27.1767, lng: 78.0081 },
        rating: 4.6,
        reviews: 1200,
        verified: false,
        priceRange: '₹₹₹',
        services: ["Emergency", "ICU", "Orthopedics"],
        operatingHours: "24/7",
        phone: "+91 562 2521234",
        specialties: ['General Medicine', 'Orthopedics']
    }
];
