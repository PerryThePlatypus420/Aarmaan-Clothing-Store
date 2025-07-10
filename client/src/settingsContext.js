import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        freeDeliveryThreshold: null,
        deliveryFee: 250
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/api/settings`);
            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Use default settings if fetch fails
            setSettings({
                freeDeliveryThreshold: null,
                deliveryFee: 250
            });
        } finally {
            setLoading(false);
        }
    };

    const refreshSettings = () => {
        setLoading(true);
        fetchSettings();
    };

    return (
        <SettingsContext.Provider 
            value={{ 
                settings, 
                loading,
                refreshSettings 
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
