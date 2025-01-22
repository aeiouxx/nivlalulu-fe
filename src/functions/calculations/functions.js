// Funkce pro výpočet celkového DPH z pole objektů
export function calculateTotalTax(items) {
    return items.reduce((total, item) => total + Number(item.taxPrice || 0), 0);
}

// Funkce pro výpočet celkové ceny položek
export function calculateTotalPrice(items) {
    return items.reduce((total, item) => total + Number(item.totalPrice || 0), 0);
}

// Funkce pro výpočet celkové částky bez DPH (základ daně)
export function calculateSubtotal(items) {
    return items.reduce(
        (total, item) =>
            total + Number(item.unitPrice || 0) * Number(item.quantity || 0),
        0
    );
}

// Funkce pro výpočet celkového počtu položek
export function calculateTotalItems(items) {
    return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
}

// Funkce pro výpočet celkové částky (sečte základ + DPH)
export function calculateGrandTotal(items) {
    const subtotal = calculateSubtotal(items);
    const totalTax = calculateTotalTax(items);
    return subtotal + totalTax;
}
