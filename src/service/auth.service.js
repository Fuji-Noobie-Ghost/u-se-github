import axios from 'axios'
import { Octokit } from 'octokit'
import jwt from 'jsonwebtoken'

class AuthService {
    // For GitHub OAuth API
    #clientId
    #clientSecret

    constructor ({ clientId, clientSecret }) {
        this.#clientId = clientId
        this.#clientSecret = clientSecret
    }

    async logInWithPAT(accessToken) {
        const octokit = new Octokit({
            auth: accessToken
        })

        try {
            await octokit.rest.users.getAuthenticated()
            return octokit
        } catch (err) {
            throw new Error('invalid')
        }
    }

    async logInWithGitHub(code) {
        const gitHubToken = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: this.#clientId,
            client_secret: this.#clientSecret,
            code
        }).then(res => res.data)

        const accessToken = gitHubToken.split('&')[0].replace('access_token=', '')
        return new Octokit({
            auth: accessToken
        })
    }

    async generateToken({ data, secretKey, expires }) {
        return new Promise((resolve, reject) => {
            jwt.sign(data, secretKey, {
                expiresIn: expires
            }, (err, encoded) => {
                if (err) reject(err)
                else resolve(encoded)
            })
        }) 
    }
}

export { AuthService }