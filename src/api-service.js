const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
// let page = 1;


export async function getQuerry(querry, page) {

    
    const params = {
        key: '29693902-d7f1c0bc4a2545a8a80ab510a',
        q: `${querry}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page,
    }

    try {
        const response = await axios.get(BASE_URL, { params });
        // page += 1;
        return response;
    } catch(error) {
    }    
}