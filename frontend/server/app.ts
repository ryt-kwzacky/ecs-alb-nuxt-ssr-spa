import express, { Request, Response, NextFunction } from 'express'
import config from '../nuxt.config'
const { Nuxt, Builder } = require('nuxt')

const app = express()
config.dev = !(process.env.NODE_ENV === 'production')

const loggerMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const log = {
    time: new Date(),
    remote_ip: request.ip,
    host: request.hostname,
    method: request.method,
    uri: request.path,
    url: request.url,
    user_agent: request.headers['user-agent'],
    status: response.statusCode,
  }
  console.info(JSON.stringify(log))
  next()
}

const start = async () => {
  const nuxt = new Nuxt(config)

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(loggerMiddleware)
  app.use(nuxt.render)

  const port = Number(process.env.PORT) || 3000
  const host = '0.0.0.0'
  app.listen(port, host)
}

start()
