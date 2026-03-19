
export interface Hospital {
    id: string;
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
    priceList: { [key: string]: number };
    operatingHours: string;
    phone: string;
    specialties: string[];
}

export interface Doctor {
    id: string;
    name: string;
    photo: string;
    specialization: string;
    hospitalId: string;
    experience: string;
    rating: number;
    availableSlots: { [key: string]: string[] };
}

export const USER_LOCATION = { lat: 27.4924, lng: 77.6737 }; // Mathura

export const HOSPITALS: Hospital[] = [
    {
        id: 'cims-mathura',
        name: 'City Institute of Medical Sciences (CIMS Hospital)',
        image: 'https://images.unsplash.com/photo-1586773860418-d372a676f015?auto=format&fit=crop&q=80&w=1000&sig=cims',
        address: 'Masani Road, Mathura',
        coordinates: { lat: 27.5090, lng: 77.6750 },
        rating: 4.8,
        reviews: 1560,
        verified: true,
        priceRange: '₹₹',
        services: ["Emergency", "ICU", "X-ray", "Pathology"],
        priceList: { "Emergency": 800, "ICU": 4500, "X-ray": 600, "Pathology": 450 },
        operatingHours: "24/7",
        phone: "+91 9258113570",
        specialties: ['General Medicine', 'Radiology', 'Pathology']
    },
    {
        id: 'neuro-mathura',
        name: 'Mathura Neuro Super Speciality Hospital',
        image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1000&sig=neuro',
        address: 'Radhika Vihar, Mathura',
        coordinates: { lat: 27.4850, lng: 77.6620 },
        rating: 4.9,
        reviews: 980,
        verified: true,
        priceRange: '₹₹₹',
        services: ["Neurology", "MRI", "X-ray"],
        priceList: { "Neurology": 1200, "MRI": 5000, "X-ray": 700 },
        operatingHours: "24/7",
        phone: "+91 9837842653",
        specialties: ['Neurology', 'Diagnostics']
    },
    {
        id: 'pr-hospital',
        name: 'P R Hospital',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000&sig=pr',
        address: 'Shivaji Nagar, Mathura',
        coordinates: { lat: 27.4910, lng: 77.6850 },
        rating: 4.6,
        reviews: 720,
        verified: true,
        priceRange: '₹',
        services: ["Emergency", "OPD", "X-ray"],
        priceList: { "Emergency": 500, "OPD": 250, "X-ray": 550 },
        operatingHours: "24/7",
        phone: "+91 7055828384",
        specialties: ['Orthopedics', 'General Medicine']
    },
    {
        id: 'aarogya-plus',
        name: 'Aarogya Plus Multisuperspeciality Hospital',
        image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1000&sig=aarogya',
        address: 'Govardhan Chauraha, Mathura',
        coordinates: { lat: 27.4820, lng: 77.6520 },
        rating: 4.7,
        reviews: 1100,
        verified: true,
        priceRange: '₹₹',
        services: ["ICU", "Emergency", "Surgery", "X-ray"],
        priceList: { "ICU": 4000, "Emergency": 700, "Surgery": 25000, "X-ray": 600 },
        operatingHours: "24/7",
        phone: "+91 9897000001",
        specialties: ['Surgery', 'Emergency']
    },
    {
        id: 'radheyshyam-hosp',
        name: 'Radheyshyam Hospital',
        image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=1000&sig=radheyshyam',
        address: 'Bhuteshwar Road, Mathura',
        coordinates: { lat: 27.5020, lng: 77.6650 },
        rating: 4.5,
        reviews: 540,
        verified: true,
        priceRange: '₹₹',
        services: ["OPD", "X-ray", "Emergency"],
        priceList: { "OPD": 300, "X-ray": 500, "Emergency": 600 },
        operatingHours: "24/7",
        phone: "+91 7078110021",
        specialties: ['Gynecology', 'General Medicine']
    },
    {
        id: 'shri-om-hosp',
        name: 'Shri Om Hospital',
        image: 'https://images.unsplash.com/photo-1511174511547-4325c2763567?auto=format&fit=crop&q=80&w=1000&sig=shriom',
        address: 'Manoharpura, Mathura',
        coordinates: { lat: 27.5150, lng: 77.6950 },
        rating: 4.6,
        reviews: 430,
        verified: true,
        priceRange: '₹₹',
        services: ["Emergency", "ICU", "X-ray"],
        priceList: { "Emergency": 750, "ICU": 3500, "X-ray": 550 },
        operatingHours: "24/7",
        phone: "+91 9720541461",
        specialties: ['Cardiology', 'Emergency']
    },
    {
        id: 'global-plus',
        name: 'Global Plus Hospital',
        image: 'https://images.unsplash.com/photo-1511174511547-4325c2763567?auto=format&fit=crop&q=80&w=1000',
        address: 'Govardhan Chauraha, Mathura',
        coordinates: { lat: 27.4815, lng: 77.6530 },
        rating: 4.4,
        reviews: 320,
        verified: true,
        priceRange: '₹₹',
        services: ["Emergency", "OPD", "X-ray"],
        priceList: { "Emergency": 650, "OPD": 200, "X-ray": 500 },
        operatingHours: "24/7",
        phone: "+91 9897123456",
        specialties: ['General Medicine']
    },
    {
        id: 'asha-hosp',
        name: 'Asha Hospital',
        image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=1000',
        address: 'Maholi Road, Mathura',
        coordinates: { lat: 27.4750, lng: 77.6820 },
        rating: 4.5,
        reviews: 280,
        verified: true,
        priceRange: '₹',
        services: ["Pathology", "X-ray", "Emergency"],
        priceList: { "Pathology": 300, "X-ray": 500, "Emergency": 500 },
        operatingHours: "24/7",
        phone: "+91 9837779163",
        specialties: ['Pathology', 'Radiology']
    },
    {
        id: 'refinery-hosp',
        name: 'Mathura Refinery Hospital',
        image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=1000',
        address: 'Refinery Township, Mathura',
        coordinates: { lat: 27.4050, lng: 77.6850 },
        rating: 4.7,
        reviews: 890,
        verified: true,
        priceRange: '₹₹',
        services: ["Emergency", "ICU", "X-ray"],
        priceList: { "Emergency": 400, "ICU": 2500, "X-ray": 400 },
        operatingHours: "24/7",
        phone: "+91 5651234567",
        specialties: ['Internal Medicine']
    },
    {
        id: 'district-hosp',
        name: 'District Hospital Mathura',
        image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1000',
        address: 'Choubey Para, Mathura',
        coordinates: { lat: 27.4950, lng: 77.7050 },
        rating: 4.2,
        reviews: 2450,
        verified: true,
        priceRange: '₹',
        services: ["Emergency", "ICU", "X-ray", "Surgery"],
        priceList: { "Emergency": 100, "ICU": 1000, "X-ray": 200, "Surgery": 5000 },
        operatingHours: "24/7",
        phone: "+91 5652400000",
        specialties: ['General Medicine', 'Surgery']
    },
    {
        id: 'kd-dental',
        name: 'KD Dental College & Hospital',
        image: 'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&q=80&w=1000',
        address: 'NH-2, Mathura',
        coordinates: { lat: 27.5350, lng: 77.6550 },
        rating: 4.6,
        reviews: 1200,
        verified: true,
        priceRange: '₹₹',
        services: ["Dental Surgery", "X-ray", "OPD"],
        priceList: { "Dental Surgery": 2000, "X-ray": 500, "OPD": 300 },
        operatingHours: "09:00 AM - 05:00 PM",
        phone: "+91 5652402000",
        specialties: ['Dentistry']
    },
    {
        id: 'saraswati-hosp',
        name: 'Maa Saraswati Hospital',
        image: 'https://images.unsplash.com/photo-1629909608185-42f4b7174401?auto=format&fit=crop&q=80&w=1000',
        address: 'Vrindavan Road, Mathura',
        coordinates: { lat: 27.5250, lng: 77.6750 },
        rating: 4.5,
        reviews: 310,
        verified: true,
        priceRange: '₹₹',
        services: ["Orthopedic", "X-ray", "Emergency"],
        priceList: { "Orthopedic": 500, "X-ray": 500, "Emergency": 600 },
        operatingHours: "24/7",
        phone: "+91 9897891234",
        specialties: ['Orthopedics']
    },
    {
        id: 'sushila-hosp',
        name: 'Sushila Hospital',
        image: 'https://images.unsplash.com/photo-1626307416562-ee83332468f7?auto=format&fit=crop&q=80&w=1000',
        address: 'Krishna Nagar, Mathura',
        coordinates: { lat: 27.4950, lng: 77.6750 },
        rating: 4.6,
        reviews: 450,
        verified: true,
        priceRange: '₹₹',
        services: ["Emergency", "X-ray", "OPD"],
        priceList: { "Emergency": 600, "X-ray": 500, "OPD": 300 },
        operatingHours: "24/7",
        phone: "+91 9897011122",
        specialties: ['Gynecology']
    },
    {
        id: 'ashok-hosp',
        name: 'Ashok Hospital',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000',
        address: 'Dampier Nagar, Mathura',
        coordinates: { lat: 27.4980, lng: 77.6950 },
        rating: 4.7,
        reviews: 640,
        verified: true,
        priceRange: '₹₹',
        services: ["Emergency", "Pathology", "X-ray"],
        priceList: { "Emergency": 700, "Pathology": 400, "X-ray": 500 },
        operatingHours: "24/7",
        phone: "+91 9897099999",
        specialties: ['General Medicine', 'Pathology']
    },
    {
        id: 'gopi-krishna-hosp',
        name: 'Gopi Krishna Hospital',
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000&sig=15',
        address: 'Vrindavan Road, Mathura',
        coordinates: { lat: 27.5210, lng: 77.6720 },
        rating: 4.8,
        reviews: 820,
        verified: true,
        priceRange: '₹₹',
        services: ["ICU", "Emergency", "X-ray"],
        priceList: { "ICU": 4500, "Emergency": 1000, "X-ray": 600 },
        operatingHours: "24/7",
        phone: "+91 9897033333",
        specialties: ['Cardiology']
    }
];

export const DOCTORS: Doctor[] = [
    { id: 'mathura-d1', name: 'Dr. Anil Sharma', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', specialization: 'General Physician', hospitalId: 'cims-mathura', experience: '15 years', rating: 4.9, availableSlots: { "2024-03-03": ["09:00 AM", "10:00 AM", "02:00 PM"] } },
    { id: 'mathura-d2', name: 'Dr. Neha Verma', photo: 'https://images.unsplash.com/photo-1594824813573-c10fe003d9f4?auto=format&fit=crop&q=80&w=400', specialization: 'Radiologist', hospitalId: 'cims-mathura', experience: '10 years', rating: 4.8, availableSlots: { "2024-03-03": ["11:00 AM", "03:00 PM"] } },
    { id: 'mathura-d3', name: 'Dr. Vivek Gupta', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', specialization: 'Neurologist', hospitalId: 'neuro-mathura', experience: '14 years', rating: 4.9, availableSlots: { "2024-03-03": ["09:30 AM", "12:00 PM"] } },
    { id: 'mathura-d4', name: 'Dr. Sandeep Tyagi', photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', specialization: 'Orthopedic', hospitalId: 'pr-hospital', experience: '12 years', rating: 4.7, availableSlots: { "2024-03-03": ["02:00 PM", "05:00 PM"] } },
    { id: 'mathura-d5', name: 'Dr. Rakesh Singh', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', specialization: 'General Surgery', hospitalId: 'aarogya-plus', experience: '18 years', rating: 4.9, availableSlots: { "2024-03-03": ["10:00 AM", "01:00 PM"] } },
    { id: 'mathura-d6', name: 'Dr. Kavita Sharma', photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400', specialization: 'Gynecologist', hospitalId: 'radheyshyam-hosp', experience: '11 years', rating: 4.8, availableSlots: { "2024-03-03": ["11:30 AM", "03:30 PM"] } },
    { id: 'mathura-d7', name: 'Dr. Manoj Agarwal', photo: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400', specialization: 'Cardiologist', hospitalId: 'shri-om-hosp', experience: '16 years', rating: 4.9, availableSlots: { "2024-03-03": ["08:00 AM", "11:00 AM"] } },
    { id: 'mathura-d8', name: 'Dr. Rahul Mehta', photo: 'https://images.unsplash.com/photo-1536064438283-32ebfd0c2401?auto=format&fit=crop&q=80&w=400', specialization: 'General Physician', hospitalId: 'global-plus', experience: '9 years', rating: 4.6, availableSlots: { "2024-03-03": ["09:00 AM", "02:00 PM"] } },
    { id: 'mathura-d9', name: 'Dr. Anjali Gupta', photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400', specialization: 'Pathologist', hospitalId: 'asha-hosp', experience: '13 years', rating: 4.8, availableSlots: { "2024-03-03": ["10:00 AM", "04:00 PM"] } },
    { id: 'mathura-d10', name: 'Dr. Pankaj Bansal', photo: 'https://images.unsplash.com/photo-1594824813573-c10fe003d9f4?auto=format&fit=crop&q=80&w=400', specialization: 'Internal Medicine', hospitalId: 'refinery-hosp', experience: '17 years', rating: 4.9, availableSlots: { "2024-03-03": ["01:00 PM", "06:00 PM"] } },
    { id: 'mathura-d11', name: 'Dr. Rajesh Kumar', photo: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=400', specialization: 'General Medicine', hospitalId: 'district-hosp', experience: '20 years', rating: 4.7, availableSlots: { "2024-03-03": ["10:00 AM", "01:00 PM"] } },
    { id: 'mathura-d12', name: 'Dr. Nitin Garg', photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', specialization: 'Dental Surgeon', hospitalId: 'kd-dental', experience: '14 years', rating: 4.8, availableSlots: { "2024-03-03": ["11:00 AM", "03:00 PM"] } },
    { id: 'mathura-d13', name: 'Dr. Deepak Jain', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', specialization: 'Orthopedic', hospitalId: 'saraswati-hosp', experience: '12 years', rating: 4.7, availableSlots: { "2024-03-03": ["09:00 AM", "12:00 PM"] } },
    { id: 'mathura-d14', name: 'Dr. Sunita Sharma', photo: 'https://images.unsplash.com/photo-1667502431910-4bbd547d002d?auto=format&fit=crop&q=80&w=400', specialization: 'Gynecology', hospitalId: 'sushila-hosp', experience: '10 years', rating: 4.6, availableSlots: { "2024-03-03": ["02:00 PM", "05:00 PM"] } },
    { id: 'mathura-d15', name: 'Dr. Ashok Gupta', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', specialization: 'General Medicine', hospitalId: 'ashok-hosp', experience: '19 years', rating: 4.8, availableSlots: { "2024-03-03": ["10:00 AM", "01:00 PM"] } },
    { id: 'mathura-d16', name: 'Dr. Ramesh Chandra', photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', specialization: 'Cardiology', hospitalId: 'gopi-krishna-hosp', experience: '15 years', rating: 4.9, availableSlots: { "2024-03-03": ["11:30 AM", "03:30 PM"] } }
];

export const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: 'Home', path: '/dashboard' },
    { id: 'hospitals', label: 'Find Hospitals', icon: 'Building2', path: '/dashboard/hospitals' },
    { id: 'appointments', label: 'My Appointments', icon: 'Calendar', path: '/dashboard/appointments' },
    { id: 'ai', label: 'AI Assistant', icon: 'MessageCircle', path: '/dashboard/ai-assistant' },
    { id: 'profile', label: 'Profile', icon: 'User', path: '/dashboard/profile' }
];
