//console.log(window.location.pathname);

const global = {
    currentPage: window.location.pathname
};


// display backdrop on details pages
function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';
    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }

}


// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = '92ea58866020e972173806ce383fdc7a';
    const API_URL = 'https://api.themoviedb.org/3/';
    showSpinner();
    const reponse = await fetch(
        `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    );
    const data = await reponse.json();
    hideSpinner();
    return data;
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    setTimeout(() => document.querySelector('.spinner').classList.remove('show'), 500);
}
/* movie card template
        <div class="card">
          <a href="movie-details.html?id=1">
            <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="Movie Title"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">Movie Title</h5>
            <p class="card-text">
              <small class="text-muted">Release: XX/XX/XXXX</small>
            </p>
          </div>
        </div>
*/

// display the most 20 popular movies
async function displayPopularMovies() { 
    const { results } = await fetchAPIData('movie/popular');
    // console.log(results);
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${movie.poster_path ?
                    `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.title}"
                    />`:
                    `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.title}"
                    />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                <small class="text-muted">Release:
                    ${movie.release_date}
                </small>
                </p>
            </div>
        `;
        document.querySelector('#popular-movies')
            .appendChild(div);
    });
}
// display movie details
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1];
    //console.log(movieId);
    const movie = await fetchAPIData(`movie/${movieId}`);
    //console.log(movie);

    //Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path);

    const div = document.createElement('div');
    div.innerHTML = `
        <div class="details-top">
            <div>
                ${movie.poster_path ?
                    `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.title}"
                    />`:
                    `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.title}"
                    />`
                }
            </div>
            <div>
            <h2>${movie.title}</h2>
            <p>
                <i class="fas fa-star text-primary"></i>
                ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
                ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
        </div>
        <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
            <li><span class="text-secondary">Budget:</span> $${numberWithCommas(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${numberWithCommas(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${numberWithCommas(movie.runtime)} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join('')}}</div>
        </div>
    `;
    document.querySelector('#movie-details').appendChild(div);
}


// display the most 20 popular shows
async function displayPopularShows() { 
    const { results } = await fetchAPIData('tv/popular');
    // console.log(results);
    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
                ${show.poster_path ?
                    `<img
                    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                    class="card-img-top"
                    alt="${show.name}"
                    />`:
                    `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${show.name}"
                    />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">
                <small class="text-muted">Air Date:
                    ${show.first_air_date}
                </small>
                </p>
            </div>
        `;
        document.querySelector('#popular-shows')
            .appendChild(div);
    });
}





// Highlight active link
function highlightActiveLink() {
    //two link nav-link
    const links = document.querySelectorAll('.nav-link');
    console.log(links);
    links.forEach((link) => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    });
}

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Init App
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            //console.log('Home');
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            console.log('TV Details');
            break;
        case '/search.html':
            console.log('Search');
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);