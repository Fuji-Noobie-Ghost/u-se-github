import express from 'express'
import helmet from 'helmet'
import hbs from 'hbs'

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

// View Engine
hbs.registerPartials('src/views/partials')
app.set('views', 'src/views')
app.set('view engine', 'hbs')

// Static Route
app.use('/static', express.static('src/static'))
app.use('/fontawesome', express.static('node_modules/@fortawesome/fontawesome-free'))
app.use('/axios', express.static('node_modules/axios'))

export { app }