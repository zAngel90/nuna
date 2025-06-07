// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rep-nvjm.onrender.com';

// Currency Configuration
export const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP'
    });
}; 