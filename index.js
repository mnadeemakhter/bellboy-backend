const server = require('./app')()
const config = require('./config/config')


server.create(config);
server.start();