import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingNavbar from './components/LandingNavbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import AISection from './components/AISection';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import { AppointmentProvider } from './lib/AppointmentContext';
import { authService } from './services/auth';

const LandingPage = () => (
    <>
        <LandingNavbar />
        <main>
            <Hero />
            <ProblemSolution />
            <Features />
            <HowItWorks />
            <AISection />
            <Stats />
            <Testimonials />
            <CTASection />
        </main>
        <Footer />
    </>
);

export default function App() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authService.getSession().then((session) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return null;

    return (
        <AppointmentProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login-success" element={session ? <LoginSuccess /> : <Navigate to="/login" replace />} />
                    <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AppointmentProvider>
    );
}
