export function removeEmptyKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => removeEmptyKeys(item));
    }

    if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj).reduce((acc, [key, value]) => {

            if (value !== '' && !(value instanceof Date && isNaN(value.getTime()))) {
                acc[key] = typeof value === 'object' ? removeEmptyKeys(value) : value;
            }
            return acc;
        }, {});
    }

    return obj;
}