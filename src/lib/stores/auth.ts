import { writable } from 'svelte/store';

// Credenciales estáticas (en una aplicación real, esto estaría en el backend)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

function createAuthStore() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        login: (username: string, password: string) => {
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                set(true);
                localStorage.setItem('isAdminAuthenticated', 'true');
                return true;
            }
            return false;
        },
        logout: () => {
            set(false);
            localStorage.removeItem('isAdminAuthenticated');
        },
        checkAuth: () => {
            const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
            set(isAuthenticated);
            return isAuthenticated;
        }
    };
}

export const isAuthenticated = createAuthStore(); 