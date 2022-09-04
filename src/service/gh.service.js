class GHService {
    #country = ''
    #userPerPage = 10
    #octokit = null

    constructor (octokit) {
        this.#octokit = octokit
    }

    getNumberOfUserPerPage() { return this.#userPerPage }
    setNumberOfUserPerPage(userPerPage) { this.#userPerPage = userPerPage }

    getLocation() { return this.#country }
    setLocation(location) { this.#country = location }

    async searchUsers(username='', pageNumber=1) {
        const users = await this.#octokit.rest.search.users({
            q: username + '+location:' + this.#country,
            page: pageNumber,
            per_page: this.#userPerPage,
            sort: 'joined'
        })

        return users.data
    }
}

export { GHService }