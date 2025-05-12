// https://restcountries.com/v3.1/all?fields=name 
//import SerpApi from 'google-search-results-nodejs';

const serpapiKey = "9a0b8b66a8c2ff39a093921cc324852293c5e052eed48a7e65be066e3db34a3d";
const unsplashKeyAccess = "krp2JlVVLvA0dtFnG4gLRV1DALKg-YNGslcYxWn5YO8";
const unsplashKeySecret = "Ay8ZfLqVAPSuDO_ZXnF9iWa-4_qQef6Pqla-nIxd70w";

export const fetchCities = async (country) => {
    const cities = [];
    try {
        const url = `https://serpapi.com/search.json?engine=google&q=Cities+in+${country}&api_key=${serpapiKey}`;
        const response = await fetch(url);
        //const response = await fetch(`https://serpapi.com/search.json?engine=google&q=Cities+in+${country}&api_key=${serpapiKey}`);
        const data = await response.json();
        const table = data.related_questions.find(q =>
            q.table !== undefined
        ).table;

        table.forEach(element => {
            let city = element[0];
            if(city !== "City"){
                cities.push(city);
            }
        });
        //console.log("adasdasdasdasd: " + cities);
        return cities
    }
    catch (error) {
        console.error('Error fetching cities:', error);
        return null;
    }
}

export const fetchImages = async (query) => {
    const images = [];
    try {
        const url = `https://serpapi.com/search.json?engine=google_images&q=${query}+monumentos&api_key=${serpapiKey}`
        const response = await fetch(url);
        const data = await response.json();
        console.log('URL: ' + url);
        console.log("API IMAGES: " + data);

        const links = data.images_results
        .filter(q =>q.thumbnail !== undefined)
        .map(q => q.thumbnail);
        
        //console.log("adasdasdasdasd: " + links);
        //const link = links[0];
        
        return links;
    }
    catch (error) {
        console.error('Error fetching images:', error);
        return null;
    }
}


export const fetchImagesUnsplash = async (city) => {
    try{
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${city}`, {
            headers: {
                Authorization: `Client-ID ${unsplashKeyAccess}`
            }
        });
        const data = await response.json();
        const urls = data.results.map(res => res.urls.raw);
        console.log("API IMAGES UNSPLASH: " + JSON.stringify(urls, null, 2));
        return urls;
    }catch (error) {
        console.error('Error fetching images Unsplash:', error);
        return null;
    }
}

export const fetchMonuments = async (city) => {
    //const monuments = [];
    try {
        const response = await fetch(`https://serpapi.com/search.json?engine=google&q=Principais+monumentos+em+${city}&api_key=${serpapiKey}`);
        const data = await response.json();
        const monuments = data.top_sights.sights
        .filter(q => q.title !== undefined)
        .map(q => q.title);
        console.log("API MONUMENTS: " + monuments );
        return monuments;
    }
    catch (error) {
        console.error('Error fetching monuments:', error);
        return null;
    }
}
 