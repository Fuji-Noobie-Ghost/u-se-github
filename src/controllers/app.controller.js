import { app } from '../modules/app.module.js'
import { verifyToken } from '../middlewares/app.middleware.js'
import { readFile } from 'fs'
import { GHService } from '../service/gh.service.js'

function AppController ({ authService }) {
    const { GH_CLIENT_ID, TOKEN_KEY } = process.env

    let octokit = null
    let ghService = null
    let currentToken = null

    app.get('/', (req, res) => {
        // URI of the GitHub OAuth API
        const ghURI = `https://github.com/login/oauth/authorize?client_id=${GH_CLIENT_ID}`
        res.render('index', { ghURI })
    })

    app.get('/login/github', async (req, res) => {
        const { code } = req.query
        if (!code) res.status(401).redirect('/')
        
        try {
            octokit = await authService.logInWithGitHub(code)
            // Generate token for user logged in
            currentToken = await authService.generateToken({
                data: (await octokit.rest.users.getAuthenticated()).data,
                secretKey: TOKEN_KEY,
                expires: '1h'
            })

            res.redirect('/users')
        } catch (err) {
            res.redirect(500, '/')
        }
    })

    // Login with Personal Access Token
    app.post('/login', async (req, res) => {
        try {
            octokit = await authService.logInWithPAT(req.body.accessToken)

            // Generate token for user logged in
            currentToken = await authService.generateToken({
                data: await octokit.rest.users.getAuthenticated(),
                secretKey: TOKEN_KEY,
                expires: '1h' 
            })
            
            res.redirect('/users')
        } catch (err) {
            if (err.message === 'invalid')
                res.redirect(400, '/')
            else res.redirect(500, '/')
        }
    })

    app.get('/users', async (req, res) => {
        // Apply verifyToken middleware

        verifyToken(currentToken)(req, res, () => {
            ghService = new GHService(octokit)
            readFile('countries.json', { encoding: 'utf-8' }, (err, data) => {
                if (err) console.log(err)
                else res.render('users', {
                    countries: JSON.parse(data)
                })
            })
        })
    })

    app.get('/search', async (req, res) => {
        
        // Apply verifyToken middleware
        verifyToken(currentToken)(req, res, async () => {
            const { location, page, username } = req.query
            try {
                ghService.setLocation(location)
                console.log(ghService.getLocation())
                res.json(await ghService.searchUsers(username, parseInt(page)))
            } catch (err) {
                res.status(500).send('Something went wrong')
            }
        })
    })
}

export { AppController }