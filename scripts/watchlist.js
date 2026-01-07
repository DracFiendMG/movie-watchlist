let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
let movieDetails = []

console.log(watchlist)

document.addEventListener('click', (e) => {
    if (e.target.dataset.imdbid) {
        const targetId = e.target.dataset.imdbid
        watchlist = watchlist.filter(id => id !== targetId)
        localStorage.setItem("watchlist", JSON.stringify(watchlist))
        movieDetails = movieDetails.filter(movie => movie.imdbID !== targetId)
        renderWatchlist()
    }
})

function fetchMovieDetails() {
    const moviePromises = watchlist.map(async imdbID => {
        return await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=f000f77b&plot=full`)
            .then(res => res.json())
    })

    Promise.all(moviePromises)
        .then(details => {
            movieDetails = details
            renderWatchlist()
        })
}

function renderWatchlist() {
    let moviesHtml = movieDetails.map(movie => {
        return `
            <div class="movie-card">
                <img src="${movie.Poster}">
                <div class="content">
                    <div class="head">
                        <h3>${movie.Title}</h3>
                        <p>${movie.imdbRating !== 'N/A' ? '<i class="fa-solid fa-star"></i>' : ''}${movie.imdbRating}</p>
                    </div>
                    <div class="subhead">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <p class="watchlist" data-imdbid="${movie.imdbID}">
                            <i class="fa-solid fa-circle-minus"></i>
                            Remove
                        </p>
                    </div>
                    <p class="desc">${movie.Plot}</p>
                </div>
            </div>
        `
    }).join("")

    document.querySelector(".movie-container").innerHTML = `
        ${movieDetails.length === 0 
            ? `<section class="empty-section">
                    <p class="empty">Your watchlist is looking a little empty...</p>
                    <a href="index.html"><p class="add"><i class="fa-solid fa-circle-plus"></i>Let's add some movies!</p></a>
                </section>` 
            : `<section class="movie-section">
                    ${moviesHtml}
                </section>`
        }
    `

    document.querySelector(".movie-section").style.display = 'flex'
}

fetchMovieDetails()