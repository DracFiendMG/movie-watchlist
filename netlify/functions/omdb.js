exports.handler = async (event) => {
    const API_KEY = process.env.API_KEY

    const params = event.queryStringParameters

    let url = `https://www.omdbapi.com/?apikey=${API_KEY}`

    for (const [key, value] of Object.entries(params)) {
        url += `&${key}=${encodeURIComponent(value)}`
    }

    try {
        const response = await fetch(url)
        const data = await response.json()

        return data
    } catch (error) {
        return error
    }
}