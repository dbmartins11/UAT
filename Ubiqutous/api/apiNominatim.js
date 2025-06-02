export const fetchCoordinates = async (cityName) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;
    const res = await fetch(url,{
      headers: {
        'User-Agent': 'TripO/1.0'
      }
    });
    console.log('URL: ' + url);
    const data = await res.json();

    const lat = data[0]?.lat;
    const lon = data[0]?.lon;

    console.log("COORDINATES: " + lat + ", " + lon);

    return lat && lon ? [parseFloat(lat), parseFloat(lon)] : null;
  } catch (error) {
    console.error('Error getting the coordinates:', error);
    return null;
  }
};
 
export const fetchSearch = async (query) => {
  try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'TripO/1.0'
          }
        });
        const data = await res.json();
        return data;
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
      }
}