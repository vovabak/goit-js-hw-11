import { getQuerry } from './api-service';
import { renderGalleryMarkup } from './template';
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


refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(evt) {
    evt.preventDefault();    

    querry = evt.currentTarget.elements.searchQuery.value;
    page = 1;
    refs.gallery.innerHTML = '';

    if (querry === '') {
        refs.loadMoreBtn.classList.add('visually-hidden');

        Notify.warning("Please, enter your search query.",
            {
                position: 'center-top',
                distance: '55px',
                showOnlyTheLastOne: true,
            },
            
        )
        return
    }

    getQuerry(querry, page)
        .then(response => {            
            Notify.success(`Hooray! We found ${response.data.totalHits} images.`,
                    {
                        position: 'center-top',
                        distance: '55px',
                        showOnlyTheLastOne: true,
                    },
                )
            renderMarkup(response);
            refs.loadMoreBtn.classList.remove('visually-hidden');
            page += 1;

            lightbox = new SimpleLightbox('.gallery a');
        })        
        .catch(onQuerryError)    
}

function onLoadMore() {
    
    getQuerry(querry, page)
        .then(response => {
            console.log(page);
            if (page > response.data.totalHits/response.data.hits.length) {
                refs.loadMoreBtn.classList.add('visually-hidden');
                Notify.warning("We're sorry, but you've reached the end of search results.",
                    {
                        position: 'center-bottom',
                        distance: '55px',
                        showOnlyTheLastOne: true,
                    },
                )                
            }
            renderMarkup(response);            
            page += 1;
            lightbox.refresh();
        })
}

function renderMarkup(markup) {

    if (markup.data.hits.length === 0) {
        throw new Error();
    }

    refs.gallery.insertAdjacentHTML('beforeend', renderGalleryMarkup(markup));   
}


function onQuerryError() {
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.classList.add('visually-hidden');
    Notify.warning("Sorry, there are no images matching your search query. Please try again.",
            {
                position: 'center-top',
                distance: '55px',
                showOnlyTheLastOne: true,
            },
    )
    
}