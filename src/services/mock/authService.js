import ApiClient from '../ApiClient';

// Simulovaný login uživatele s falešným tokenem
export const loginUser = async (credentials) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockToken = 'mock-token-12345';
            ApiClient.setAuthToken(mockToken); // Uložení falešného tokenu do cookies
            resolve({ user: { name: 'Mock User' }, token: mockToken });
        }, 1000); // Simulované zpoždění 1 sekundu
    });
};

// Simulovaná registrace uživatele s falešným tokenem
export const registerUser = async (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockToken = 'mock-token-12345';
            ApiClient.setAuthToken(mockToken); // Uložení falešného tokenu do cookies
            resolve({ user: { name: 'New Mock User' }, token: mockToken });
        }, 1000); // Simulované zpoždění 1 sekundu
    });
};

// Odhlášení uživatele
export const logoutUser = () => {
    ApiClient.setAuthToken(null); // Odstraní token z hlaviček a cookies
};
