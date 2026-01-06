export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const truncate = (text, length = 100) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
};
