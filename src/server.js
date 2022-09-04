import { app } from './modules/app.module.js'
import { AppController } from './controllers/app.controller.js'
import { AuthService } from './service/auth.service.js'

function Server(port, host) {
    const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env

    AppController({
        authService: new AuthService({
            clientId: GH_CLIENT_ID,
            clientSecret: GH_CLIENT_SECRET
        })
    })

    app.get('*', (req, res) => res.status(404).render('notfound', { route: req.url }))

    app.listen(port, host, () => {
        console.log(`Server listening on http://${host}:${port}`)
    })
}

export { Server }