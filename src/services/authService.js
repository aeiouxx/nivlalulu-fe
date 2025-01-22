import ApiClient from './ApiClient';

function generateToken(length = 20) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

class AuthService {
    // Registrace nového uživatele
    async registerUser(username, password, email) {
        return await ApiClient.post('/api/public/v1/auth/register', { username, email, password});
    }

    // Přihlášení uživatele
    async loginUser(username, password) {
        const users = await ApiClient.get('/api/public/v1/auth/login');
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            throw new Error('Neplatné přihlašovací údaje');
        }

        ApiClient.setAuthToken(user.token);
        return { user, token: user.token };
    }

    // Odhlášení uživatele
    logoutUser() {
        ApiClient.setAuthToken(null);
    }

    async getUserFromToken() {
        try {
            const token = await ApiClient.getTokenFromCookies();
            console.log(token)
            if (!token) throw new Error('Token není k dispozici');

            // Pošle požadavek na server s tokenem jako parametrem
            const response = await ApiClient.get(`/users?token=${token}`);
            if (response) {
                return response[0]; // Očekáváme, že server vrátí odpovídajícího uživatele
            } else {
                throw new Error('Uživatel s tímto tokenem nebyl nalezen');
            }
        } catch (error) {
            console.error('Chyba při získávání uživatele z tokenu:', error);
            throw error;
        }
    }

    async updateUserProfile(userData) {
        try {
            console.log(userData)
            const response = await ApiClient.put(`/users/${userData.id}`, userData); // Endpoint `/users/me` by měl aktualizovat údaje o uživateli
            return response;
        } catch (error) {
            console.error('Chyba při aktualizaci profilu uživatele:', error);
            throw error;
        }
    }
}

export default new AuthService();
