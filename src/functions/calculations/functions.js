// Výpočet celkové daně
export function calculateTotalTax(items = []) {
    return items.reduce((total, item) => {
        const taxPrice = Number(item?.taxPrice || 0);
        const quantity = Number(item?.quantity || 0);
        return total + taxPrice * quantity;
    }, 0).toFixed(2);
}

// Výpočet celkové jednotkové ceny
export function calculateTotalUnitPrice(items = []) {
    return items.reduce((total, item) => {
        const quantity = Number(item?.quantity || 0);
        const unitPrice = Number(item?.unitPrice || 0);
        return total + unitPrice * quantity;
    }, 0).toFixed(2);
}

// Výpočet mezisoučtu
export function calculateSubtotal(items = []) {
    return items.reduce((total, item) => {
        const unitPrice = Number(item?.unitPrice || 0);
        const quantity = Number(item?.quantity || 0);
        return total + unitPrice * quantity;
    }, 0).toFixed(2);
}

// Výpočet celkového počtu položek
export function calculateTotalItems(items = []) {
    return items.reduce((total, item) => {
        const quantity = Number(item?.quantity || 0);
        return total + quantity;
    }, 0).toFixed(2);
}

// Výpočet celkové částky
export function calculateGrandTotal(items = []) {
    const subtotal = Number(calculateSubtotal(items));
    const totalTax = Number(calculateTotalTax(items));
    return (subtotal + totalTax).toFixed(2);
}

// Zpracování položek
export function processItems(items = []) {
    return items.map(item => {
        const unitPrice = Number(item?.unitPrice || 0);
        const quantity = Number(item?.quantity || 0);

        const taxPrice = Number((unitPrice * 0.21).toFixed(2));
        const totalPrice = Number((quantity * unitPrice + quantity * taxPrice).toFixed(2));

        return {
            ...item,
            taxPrice,
            totalPrice,
        };
    });
}

// Aktualizace cen a hodnot
export function updatePrices(jsonData = {}) {
    const items = processItems(jsonData.items || []);

    return {
        ...jsonData,
        items,
        raw_value: calculateTotalUnitPrice(items).toString(),
        tax_value: calculateTotalTax(items).toString(),
        total_value: calculateGrandTotal(items).toString(),
    };
}
