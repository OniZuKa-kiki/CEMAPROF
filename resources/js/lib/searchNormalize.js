export function normalizeSearchText(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export function matchesSearch(haystack, needle) {
    const query = normalizeSearchText(needle);
    if (!query) {
        return true;
    }

    return normalizeSearchText(haystack).includes(query);
}
