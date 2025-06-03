const unsplashKeyAccess = "krp2JlVVLvA0dtFnG4gLRV1DALKg-YNGslcYxWn5YO8";
const unsplashKeySecret = "Ay8ZfLqVAPSuDO_ZXnF9iWa-4_qQef6Pqla-nIxd70w";

export const fetchImagesUnsplash = async (city) => {
    try {
        const url = `https://api.unsplash.com/search/photos?query=${city}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Client-ID ${unsplashKeyAccess}`
            }
        });

        console.log('URL: ' + url);

        const text = await response.text();
        try {
            const data = JSON.parse(text);
            const urls = data.results.map(res => res.urls.small);
            return urls;
        } catch (jsonError) {
            console.error('Unsplash response is not JSON:', text);
            return [];
        }
    } catch (error) {
        console.error('Error fetching images Unsplash:', error);
        return null;
    }
}