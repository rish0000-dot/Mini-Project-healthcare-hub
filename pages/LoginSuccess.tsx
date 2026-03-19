import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically redirect to the dashboard after a short delay
        const timer = setTimeout(() => {
            navigate('/dashboard', { replace: true });
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <h1 className="text-2xl font-black text-slate-800 tracking-wider uppercase">
                Login Successful
            </h1>
        </div>
    );
};

export default LoginSuccess;
