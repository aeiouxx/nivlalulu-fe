export const fetchInvoices = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Faktura č. 1' },
                { id: 2, name: 'Faktura č. 2' },
                { id: 3, name: 'Faktura č. 3' },
            ]);
        }, 1000); // Simulace zpoždění 1 sekundy
    });
};
