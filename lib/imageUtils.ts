export const normalizeDriveLink = (url: string) => {
    if (!url) return '';
    try {
        let id = '';
        if (url.includes('/file/d/')) {
            const parts = url.split('/file/d/');
            id = parts[1].split('/')[0];
        } else if (url.includes('id=')) {
            const params = new URLSearchParams(url.split('?')[1]);
            id = params.get('id') || '';
        }

        if (id) {
            // Use lh3.googleusercontent.com endpoint which is more reliable for direct embedding and hotlinking
            return `https://lh3.googleusercontent.com/d/${id}`;
        }
        return url;
    } catch (e) {
        return url;
    }
};
