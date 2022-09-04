export function renderGalleryMarkup(murkup) {
    const photos = murkup.data.hits;

    const markup = photos.map(photo =>
        `<div class="photo-card">
            <a href="${photo.largeImageURL}">
                <img src="${photo.webformatURL}" alt="${photo.tags}" title="" loading="lazy"/>            
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes: ${photo.likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${photo.views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${photo.comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${photo.downloads}</b>
                </p>
            </div>
        </div>`
    )
        .join('');
    
    return markup;
}