import { getQuerry } from './api/api-service';
import { renderGalleryMarkup } from './templates/renderGalleryMarkup';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('[name="searchQuery"]'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}
let querry = '';
let page;
let lightbox;
const notifyParams = {
                position: 'center-top',
                distance: '55px',
                showOnlyTheLastOne: true,
            }


refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(evt) {
    evt.preventDefault();
    
    if (evt.currentTarget.elements.searchQuery.value.trim() === '') {        

        Notify.warning("Please, enter your search query.", notifyParams)

        return
    }

    if (evt.currentTarget.elements.searchQuery.value.trim() === querry) {        

        Notify.warning("Please, try another search query.", notifyParams)

        return
    }

    querry = evt.currentTarget.elements.searchQuery.value.trim();
    page = 1;
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.classList.add('visually-hidden');


    getQuerry(querry, page)
        .then(response => {            

            if (response.data.hits.length === 0) {
                Notify.warning("Sorry, there are no images matching your search query. Please try again.",
                    notifyParams);
                return
            }

            renderMarkup(response);

            Notify.success(`Hooray! We found ${response.data.totalHits} images.`, notifyParams)
            
            if (response.data.totalHits > response.config.params.per_page) {
                refs.loadMoreBtn.classList.remove('visually-hidden');
            }           

            lightbox = new SimpleLightbox('.gallery a');
        })        
        .catch(onQuerryError)
}

function onLoadMore() {
    
    page += 1;
    getQuerry(querry, page)        
        .then(response => {            
            if (page > response.data.totalHits/response.config.params.per_page) {
                refs.loadMoreBtn.classList.add('visually-hidden');
                
                Notify.warning("We're sorry, but you've reached the end of search results.",
                    notifyParams)
            }
            renderMarkup(response);        
            
            lightbox.refresh();
        })
}

function renderMarkup(gallery) {
    refs.gallery.insertAdjacentHTML('beforeend', renderGalleryMarkup(gallery.data.hits));   
}


function onQuerryError() {    
    Notify.failure("Woops, something went wrong. Please, keep calm and do your job", notifyParams)    
}