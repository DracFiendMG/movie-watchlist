let movies = []
let movieDetails = []
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

const emptySection = document.querySelector(".empty-section")
const movieSection = document.querySelector(".movie-section")
const errorSection = document.querySelector(".error-section")
const searchForm = document.getElementById('search-bar')

document.addEventListener('click', (e) => {
    if (e.target.dataset.imdbid) {
        const targetId = e.target.dataset.imdbid
        if (watchlist.includes(targetId)) {
            watchlist = watchlist.filter(id => id !== targetId)
        } else {
            watchlist.push(targetId)
        }
        localStorage.setItem("watchlist", JSON.stringify(watchlist))
        renderMovies()
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

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchFormData = new FormData(searchForm)

    const text = searchFormData.get("search")

    if (text) {
        searchResults(text)
    }
})

function searchResults(text) {
    fetch(`https://www.omdbapi.com/?apikey=f000f77b&s=${text}`)
        .then(res => res.json())
        .then(data => {
            if (data.Search.length === 0) {
                throw new Error("No movies found")
            }
            movies = data.Search
            emptySection.style.display = 'none'
            movieSection.style.display = 'flex'
            errorSection.style.display = 'none'
            fetchMovieDetails()
        })
        .catch(error => {
            emptySection.style.display = 'none'
            movieSection.style.display = 'none'
            errorSection.style.display = 'flex'
            renderError()
        })
}

function fetchMovieDetails() {
    const moviePromises = movies.map(async movie => {
        return await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=f000f77b&plot=full`)
            .then(res => res.json())
    })

    Promise.all(moviePromises)
        .then(details => {
            movieDetails = details
            renderMovies()
        })
}

function renderMovies() {
    let moviesHtml = movieDetails.map(movie => {
        addReadMore(movie.Plot)
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
                            ${watchlist.includes(movie.imdbID) 
                                ? '<i class="fa-solid fa-circle-check"></i>' 
                                : '<i class="fa-solid fa-circle-plus"></i>'
                            }
                            Watchlist
                        </p>
                    </div>
                    <p class="desc">${movie.Plot.length > 140 ? addReadMore(movie.Plot, movie.imdbID) : movie.Plot}</p>
                </div>
            </div>
        `
    }).join("")

    movieSection.innerHTML = moviesHtml
}

function renderError() {
    document.querySelector(".error-section").innerHTML = `
        <p>Unable to find what you’re looking for. Please try another search.</p>
    `
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