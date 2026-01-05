let movies = []

fetch("http://www.omdbapi.com/?apikey=f000f77b&s=Blade Runner")
    .then(res => res.json())
    .then(data => {
        console.log(data.Search)
        movies = data.Search
        renderMovies()
    })

function fetchMovieDetails(imdbId) {
    return fetch(`http://www.omdbapi.com/?i=${imdbId}&apikey=f000f77b`)
        .then(res => res.json())
        .then(data => data)
}

function renderMovies() {
    let moviesHtml = movies.map(movie => {
        return `
            <div class="movie-card">
                <img src="${movie.Poster}">
                <div class="content">
                    <div class="head">
                        <h3>${movie.Title}</h3>
                        <p>8.1</p>
                    </div>
                    <div class="subhead">
                        <p>116min</p>
                        <p>Drama, Mystery, Sci-fi</p>
                        <p>Watchlist</p>
                    </div>
                    <p class="desc">Description</p>
                </div>
            </div>
        `
    }).join('')
    document.querySelector(".movie-section").innerHTML = moviesHtml
}