const watchlistSection = document.querySelector('.movie-section')

const watchlist = JSON.parse(localStorage.getItem("watchlist")) || ''

console.log(watchlist)

function fetchMovieDetails() {
    const moviePromises = movies.map(async movie => {
        return await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=f000f77b`)
            .then(res => res.json())
    })

    Promise.all(moviePromises)
        .then(details => {
            movieDetails = details
            console.log(movieDetails)
            renderWatchlist()
        })
}

function renderWatchlist() {
    const moviesHtml = watchlist.map(movie => {

    })
}