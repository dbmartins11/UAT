// https://restcountries.com/v3.1/all?fields=name 
//import SerpApi from 'google-search-results-nodejs';

const serpapiKey = "9a0b8b66a8c2ff39a093921cc324852293c5e052eed48a7e65be066e3db34a3d";


const popularTouristCountries = [
    "Portugal", "France", "Spain", "USA", "China", "Italy", "Turkey",
    "Mexico", "Germany", "Thailand", "Greece", "Japan", "Brazil",
];

export const fetchCities = async (country) => {
    const cities = [];
    try {
        const response = await fetch(`https://serpapi.com/search.json?engine=google&q=Cities+in+${country}&api_key=${serpapiKey}`);
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
        console.log("adasdasdasdasd: " + cities);
        return data
    }
    catch (error) {
        console.error('Error fetching cities:', error);
        return null;
    }
}

