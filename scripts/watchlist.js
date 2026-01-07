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
    } else if (e.target.dataset.more) {
        const id = e.target.dataset.more
        document.querySelector(`.more-${id}`).style.display = 'none'
        document.querySelector(`.content-${id}`).style.display = 'inline'
        document.querySelector(`.less-${id}`).style.display = 'inline'
    } else if (e.target.dataset.less) {
        const id = e.target.dataset.less
        document.querySelector(`.more-${id}`).style.display = 'inline'
        document.querySelector(`.content-${id}`).style.display = 'none'
        document.querySelector(`.less-${id}`).style.display = 'none'
    }
})

function fetchMovieDetails() {
    const moviePromises = watchlist.map(async imdbID => {
        return await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=f000f77b&plot=full`)
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
                    <p class="desc">${movie.Plot.length > 140 ? addReadMore(movie.Plot, movie.imdbID) : movie.Plot}</p>
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

    if (movieDetails.length !== 0) {
        document.querySelector(".movie-section").style.display = 'flex'
    }
}

function addReadMore(text, id) {
    return text.substring(0, 140) 
    + `<span class="read-more more-${id}" data-more="${id}">
            ...Read More
        </span>
        <span class="read-content content-${id}">` 
    + text.substring(140) 
    + `</span>
        <span class="read-less less-${id}" data-less="${id}">
            ...Read Less
        </span>`
}

fetchMovieDetails()