
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface Booking {
    id: string;
    user_id: string;
    hospital_name: string;
    doctor_name: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Completed' | 'Cancelled';
    created_at?: string;
}

interface AppointmentContextType {
    appointments: Booking[];
    loading: boolean;
    fetchAppointments: () => Promise<void>;
    addAppointment: (booking: Omit<Booking, 'id' | 'status' | 'user_id'>) => Promise<void>;
    updateStatus: (id: string, status: 'Completed' | 'Cancelled') => Promise<void>;
    deleteAppointment: (id: string) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appointments, setAppointments] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: true });

            if (error) throw error;
            setAppointments(data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const addAppointment = async (booking: Omit<Booking, 'id' | 'status' | 'user_id'>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('appointments')
                .insert([{ ...booking, user_id: user.id, status: 'Confirmed' }]);

            if (error) throw error;
            await fetchAppointments();
        } catch (error) {
            console.error('Error adding appointment:', error);
            throw error;
        }
    };

    const updateStatus = async (id: string, status: 'Completed' | 'Cancelled') => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            await fetchAppointments();
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    const deleteAppointment = async (id: string) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchAppointments();
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <AppointmentContext.Provider value={{ 
            appointments, 
            loading, 
            fetchAppointments, 
            addAppointment, 
            updateStatus, 
            deleteAppointment 
        }}>
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointments = () => {
    const context = useContext(AppointmentContext);
    if (!context) throw new Error('useAppointments must be used within AppointmentProvider');
    return context;
};
