export const fetchMonumentDescription = async (monumentName) => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(monumentName)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.extract) {
      return data.extract;
    } else {
      return "Descrição não encontrada.";
    }
  } catch (error) {
    console.error("Erro ao buscar descrição:", error);
    return null;
  }
};

export const fetchMonumentsWiki = async (city) => {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Attractions+in+${city}&format=json&origin=*`;
    console.log('URL: ' + url);

    const response = await fetch(url);
    const data = await response.json();

    let monuments = data.query.search.map(item => item.title);

    monuments = monuments.slice(0, 6);

    console.log("Monuments:", monuments);
    return monuments;
  } catch (error) {
    console.error('Error fetching monuments:', error);
    return [];
  }
};
