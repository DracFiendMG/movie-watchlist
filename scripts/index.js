let movies = []
let movieDetails = []
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

console.log(watchlist)

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
    fetch(`http://www.omdbapi.com/?apikey=f000f77b&s=${text}`)
        .then(res => res.json())
        .then(data => {
            console.log(data.Search)
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
        return await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=f000f77b`)
            .then(res => res.json())
    })

    Promise.all(moviePromises)
        .then(details => {
            movieDetails = details
            console.log(movieDetails)
            renderMovies()
        })
}

function renderMovies() {
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
                            ${watchlist.includes(movie.imdbID) 
                                ? '<i class="fa-solid fa-circle-check"></i>' 
                                : '<i class="fa-solid fa-circle-plus"></i>'
                            }
                            Watchlist
                        </p>
                    </div>
                    <p class="desc">${movie.Plot}</p>
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