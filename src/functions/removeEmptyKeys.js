export function removeEmptyKeys(obj) {
    // Pokud je vstupní objekt pole, iterujeme přes každou jeho položku
    if (Array.isArray(obj)) {
        return obj.map(item => removeEmptyKeys(item));
    }

    // Pokud je vstupní objekt skutečně objekt
    if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            // Pokud hodnota není prázdný řetězec nebo platný objekt Date, pokračujeme
            if (value !== '' && !(value instanceof Date && isNaN(value.getTime()))) {
                // Rekurzivní volání pro vnořené objekty nebo pole
                acc[key] = typeof value === 'object' ? removeEmptyKeys(value) : value;
            }
            return acc;
        }, {});
    }

    // Pokud vstup není objekt ani pole, vrátíme jej nezměněný
    return obj;
}