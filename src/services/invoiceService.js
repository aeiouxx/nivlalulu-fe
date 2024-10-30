import ApiClient from './ApiClient';

class InvoiceService {
    // Načte všechny faktury
    async getAllInvoices() {
        return await ApiClient.get('/invoices');
    }

    // Načte konkrétní fakturu podle ID
    async getInvoiceById(id) {
        return await ApiClient.get(`/invoices/${id}`);
    }

    // Přidá novou fakturu
    async addInvoice(newInvoice) {
        return await ApiClient.post('/invoices', newInvoice);
    }

    // Aktualizace faktury podle ID
    async updateInvoice(id, updatedInvoice) {
        return await ApiClient.put(`/invoices/${id}`, updatedInvoice);
    }

    // Smazání faktury podle ID
    async deleteInvoice(id) {
        return await ApiClient.delete(`/invoices/${id}`);
    }
}

export default new InvoiceService();
