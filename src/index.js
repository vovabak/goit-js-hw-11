import { getQuerry } from './api/api-service';
import { renderGalleryMarkup } from './templates/renderGalleryMarkup';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix';

const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('[name="searchQuery"]'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}
let querry = '';
let page;
let lightbox;
const notifyOptions = {
                position: 'center-top',
                distance: '55px',
                showOnlyTheLastOne: true,
}

const infiniteScrollOptions = {    
    rootMargin: '0px',
    threshold: 1.0
}

const observer = new IntersectionObserver(scrollCallBack, infiniteScrollOptions);
let target;

refs.form.addEventListener('submit', onSubmit);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(evt) {
    evt.preventDefault();
    
    if (evt.currentTarget.elements.searchQuery.value.trim() === '') {        

        Notify.warning("Please, enter your search query.", notifyOptions)

        return
    }

    if (evt.currentTarget.elements.searchQuery.value.trim() === querry) {        

        Notify.warning("Please, try another search query.", notifyOptions)

        return
    }

    querry = evt.currentTarget.elements.searchQuery.value.trim();
    page = 1;
    refs.gallery.innerHTML = '';
    // refs.loadMoreBtn.classList.add('visually-hidden');


    getQuerry(querry, page)
        .then(response => {            

            if (response.data.hits.length === 0) {
                Notify.warning("Sorry, there are no images matching your search query. Please try again.",
                    notifyOptions);
                return
            }

            renderMarkup(response);
            
            target = refs.gallery.lastElementChild;
            observer.observe(target);

            Notify.success(`Hooray! We found ${response.data.totalHits} images.`, notifyOptions)
            
            // if (response.data.totalHits > response.config.params.per_page) {
            //     refs.loadMoreBtn.classList.remove('visually-hidden');                
            // }

            if (response.data.totalHits < response.config.params.per_page) {                
                observer.disconnect();
            }

            const { height: cardHeight } = refs.form.getBoundingClientRect();

            window.scrollBy({                
                top: cardHeight,
                behavior: "smooth",
            });            

            lightbox = new SimpleLightbox('.gallery a');
        })        
        .catch(onQuerryError)
}

function scrollCallBack(entries, observer) {

    // const arr = observer.takeRecords();
    // console.log(arr);
    // console.log(entries[0]);
    // console.log(entries[0].isIntersecting);    
    // if (entries[0].intersectionRatio <= 0) return;
    

    if (entries[0].isIntersecting) {
        onLoadMore();
    };

    target = refs.gallery.lastElementChild;
    observer.observe(target);
}

function onLoadMore() {
    
    page += 1;
    getQuerry(querry, page)        
        .then(response => {            
            if (page > response.data.totalHits/response.config.params.per_page) {
                // refs.loadMoreBtn.classList.add('visually-hidden');
                // observer.unobserve(target);

                Notify.warning("We're sorry, but you've reached the end of search results.",
                    notifyOptions)                
                
                observer.disconnect();
            }
            renderMarkup(response);            
            
            lightbox.refresh();            
        })    
}

function renderMarkup(gallery) {
    refs.gallery.insertAdjacentHTML('beforeend', renderGalleryMarkup(gallery.data.hits));   
}

function onQuerryError() {    
    Notify.failure("Woops, something went wrong. Please, keep calm and do your job", notifyOptions)    
}