const { Db, Connection, Server } = require('mongodb')
const settings = require('../settings')

module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}))
