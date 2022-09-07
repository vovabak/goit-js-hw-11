import axios from "axios";
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29693902-d7f1c0bc4a2545a8a80ab510a';

export async function getQuerry(q, page) {

    
    const params = {
        key: KEY,
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page,
    }
  
    const response = await axios.get(BASE_URL, { params });
    return response;    
}