import { Server } from './src/server.js'
import { config } from 'dotenv'

config()

Server(process.env.PORT, process.env.HOST)