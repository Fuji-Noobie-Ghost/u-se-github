// import axios from "axios"

const country = document.getElementById('country')
const username = document.getElementById('username')
const searchBtn = document.getElementById('search-btn')
const cardTarget = document.getElementById('card-target')

const prev = document.getElementById('prev')
const next = document.getElementById('next')

let currentPage = 1
let total = 0

prev.addEventListener('click', async () => {
    if (currentPage > 1) {
        cardTarget.innerHTML = ''
        await searchRequest(country.value.toLowerCase(), --currentPage, username.value)
    }
})

next.addEventListener('click', async () => {
    if (currentPage * 10 < total) {
        cardTarget.innerHTML = ''
        await searchRequest(country.value.toLowerCase(), ++currentPage, username.value)
    }
})

country.addEventListener('change', async () => {
    cardTarget.innerHTML = ''
    username.removeAttribute('disabled')

    await searchRequest(country.value.toLowerCase(), currentPage, username.value)
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
    total = users.total_count
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