// https://restcountries.com/v3.1/all?fields=name 
//import SerpApi from 'google-search-results-nodejs';

//const serpapiKey = "9a0b8b66a8c2ff39a093921cc324852293c5e052eed48a7e65be066e3db34a3d";
//const serpapiKey = "19c034da5f127caa07dd49deb7265b97507d0617364b68ee20b53ce350967e2a";
const serpapiKey = "753aa196b9ddd121b643984c91ba8b2aa95b0488ef6fd9c37b620ab93fc2fe5a";

export const fetchCities = async (country) => {
    const cities = [];
    try {
        const url = `https://serpapi.com/search.json?engine=google&q=Cities+in+${country}&api_key=${serpapiKey}`;
        const response = await fetch(url);
        console.log('URL: ' + url);
        //const response = await fetch(`https://serpapi.com/search.json?engine=google&q=Cities+in+${country}&api_key=${serpapiKey}`);
        const data = await response.json();
        const dataFiltered = data.answer_box?.expanded_list || [];
        const titles = dataFiltered.map(item => item.title);
        titles.forEach(element => {
            let city = element.replace('.', '');
            if (city !== "City") {
                cities.push(city);
            }
        });
        return cities
    }
    catch (error) {
        console.error('Error fetching cities:', error);
        return null;
    }
}

export const fetchMonuments = async (city) => {
    //const monuments = [];
    try {
        const url = `https://serpapi.com/search.json?engine=google&q=Monuments+in+${city}&api_key=${serpapiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log('URL: ' + url);

        let monuments = [];
        const listBlock = data.ai_overview?.text_blocks?.find(block => block.type === "list");

        if (listBlock) {
            monuments = listBlock?.list?.map(item => item.title.replace(':', ''));
        }
        console.log("Monuments: " + monuments);

        if (monuments.length === 0) {
            const list = data.answer_box?.expanded_list
            if (list) {
                monuments = list.map(item => item.title.replace(':', ''));
            }
        }

        return monuments;
    }
    catch (error) {
        console.error('Error fetching monuments:', error);
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
            .filter(q => q.thumbnail !== undefined)
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

