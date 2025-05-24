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
 