// https://restcountries.com/v3.1/all?fields=name 
//import SerpApi from 'google-search-results-nodejs';

const serpapiKey = "9a0b8b66a8c2ff39a093921cc324852293c5e052eed48a7e65be066e3db34a3d";
//const serpapiKey = "3af196b3ca8c79dbfeb3fcd15e6cd7dd5345d8262c1b54c28563cef3acb0393d";
//const serpapiKey = "4e98542a904704326025cb365970f8ed4872ec7409a12a269c69a2ad330a53b8";
//const serpapiKey = "853a1f322b12dab40c3953fe617a7f50d08526319c71dfa407a1f073de1ad423";
//const serpapiKey = "1ed1445f6fb16897f8701ae539545fc9f8cbb05c2fdaf432addd4b0fbc8e250a";
//const serpapiKey = "19c034da5f127caa07dd49deb7265b97507d0617364b68ee20b53ce350967e2a";
//const serpapiKey = "753aa196b9ddd121b643984c91ba8b2aa95b0488ef6fd9c37b620ab93fc2fe5a";

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
        const url = `https://serpapi.com/search.json?engine=google&q=Sights+${city}&api_key=${serpapiKey}`;
        console.log('URL: ' + url);
        const response = await fetch(url);
        const data = await response.json();
        const monuments = data.top_sights.sights
        .filter(q => q.title !== undefined)
        .map(q => q.title);
        console.log("API MONUMENTS: " + monuments );

        const sliced = monuments.slice(0, 10);
        console.log("API MONUMENTS: " + sliced );

        return sliced;
    }
    catch (error) {
        console.error('Error fetching monuments:', error);
        return [];
    }
}

export const search = async (query) => {
    try {
        const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${serpapiKey}`;
        console.log('URL: ' + url);
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching:', error);
        return null;
    }
}