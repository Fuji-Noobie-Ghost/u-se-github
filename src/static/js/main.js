// import axios from "axios"

const country = document.getElementById('country')
const username = document.getElementById('username')
const searchBtn = document.getElementById('search-btn')
const cardTarget = document.getElementById('card-target')

const prev = document.getElementById('prev')
const next = document.getElementById('next')

let currentPage = 1

prev.addEventListener('click', () => {
    if (currentPage)
})

country.addEventListener('change', async () => {
    cardTarget.innerHTML = ''
    username.removeAttribute('disabled')

    const users = await searchRequest(country.value.toLowerCase(), currentPage, username.value)

    users.items.forEach(user => {
        createCard({
            img: user.avatar_url,
            name: user.login,
            link: user.html_url,
            target: cardTarget
        })
    })
})

searchBtn.addEventListener('click', async () => {
    cardTarget.innerHTML = ''
    if (!username.getAttribute('disabled')) {
        await searchRequest(country.value.toLowerCase(), currentPage, username.value)
    }
})

async function searchRequest (location, page, name) {
    let users = await axios.get(`http://localhost:8080/search?location=${location}&page=${page}&username=${name}`)
    users = users.data
    users.items.forEach(user => {
        createCard({
            img: user.avatar_url,
            name: user.login,
            link: user.html_url,
            target: cardTarget
        })
    })
}

function createCard({ target, img, name, link }) {
    const card = document.createElement('div')
    card.classList.add('list-item')
    card.innerHTML = `
        <div class="card" href="${link}">
            <h1 class="title">${name}</h1>
        </div>
    `

    target.appendChild(card)
}