import axios from 'axios';

const key1 = '7fqj9hHvAsG3pusNTvCVWf4EXooviqXaXqhv6fJmUeu7PzA3GOxKJQQJ99BFAC5RqLJXJ3w3AAAbACOGHkVx';


const AZURE_REGION = 'westeurope'; // Ex: 'westeurope'
const ENDPOINT = 'https://api.cognitive.microsofttranslator.com';

export const translateAzure = async (text, toLang = 'pt') => {
  try {
    const response = await axios.post(
      `${ENDPOINT}/translate?api-version=3.0&to=${toLang}`,
      [{ Text: text }],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': key1,
          'Ocp-Apim-Subscription-Region': AZURE_REGION,
          'Content-Type': 'application/json',
        },
      }
    );

    const translatedText = response.data[0].translations[0].text;
    return translatedText;
  } catch (error) {
    console.error('Erro ao traduzir com Azure:', error?.response?.data || error.message);
    return text; // fallback para o original
  }
};