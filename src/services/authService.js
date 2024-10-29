import ApiClient from './ApiClient';

// Přihlášení uživatele
export const loginUser = async (credentials) => {
    try {
        const response = await ApiClient.post('/login', credentials);
        ApiClient.setAuthToken(response.token); // Uložení tokenu pro relaci
        return response.user; // Vraťte uživatelská data pro další použití
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Registrace uživatele
export const registerUser = async (data) => {
    try {
        const response = await ApiClient.post('/register', data);
        ApiClient.setAuthToken(response.token); // Uložení tokenu po registraci
        return response.user; // Vraťte uživatelská data
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

// Odhlášení uživatele
export const logoutUser = () => {
    ApiClient.setAuthToken(null); // Odstraní token z hlaviček a cookies
};
