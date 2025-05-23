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