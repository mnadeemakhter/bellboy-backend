const morgan = require('morgan')
const express = require('express')
const config = require('./config/config')
const cors = require('cors')
const mongoose = require('mongoose')
const moment = require('moment-timezone')
const constants = require('./config/constants');
const http = require('http');

const Usersdata = require("./users");


module.exports = () => {
    
    let app = express(), create, start;
    let server=http.createServer(app);
    const io = require('socket.io')(server);
    app.io = io;

    create = function (config) {
        let routes = require('./routes');


        //Server Settings

        app.set('port', config.port);
        app.set('hostname', config.hostname);


        // moment.tz.setDefault("America/New_York");
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }))

        app.use(morgan('dev'));

        //CORS Handling
        app.use(cors());

        //Accessing Directory for storage of uploads
        app.use('/public/uploads', express.static('public/uploads'));
        app.use('/images', express.static('images'));

        //Configuration for Routes
        app.use('/', routes);
        
        // moment.tz.setDefault(constants.timeZone);
        
        app.use((req, res) => {
            res.status(404).json({ error: 'not found' });
        });
        app.use((err, req, res, next) => {
            console.log("err",err)
            return res.status(err.code || 500).json({
                success: err.success || false,
                code:err.code,
                data: {},
                ...err, message: err.message || "uh -oh something went wrong"
            });
        });

    }

    start = () => {
        let hostname = app.get('hostname');
        let port = app.get('port');

        app.on(('home'), (req, res) => {
            res.send('Welcome to BellBoy');
        })

        var uri = config.server_database;

        const client = mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex:true
        })

        mongoose.set('debug', true);

        mongoose.Promise = global.Promise;
        var db = mongoose.connection;
        const bellboySocket=io.of("/bellboy");
        io.on('connection', client => {
            console.log("connected [app.js]")
            client.on('event', data => { 
                console.log("event data",data)
             });
            client.on('disconnect', () => { 
                console.log("disconnect [app.js]")
             });
        });
        db.on(('error'), console.error.bind(console, 'MongoDB connection Error'));
        db.once('open', async () => {
            console.log('DB is successfully connected');
            

            server.listen(port, () => {

                console.log('Database is connected successfully && app started at = ' + hostname + ':' + port);
                Usersdata.removeAllUser();
                console.log("total users",Usersdata.getAllUser().length);
            })
        })
        require("./socket")(bellboySocket)


        unhandledRoutes = () => {
            app.use((req, res, next) => {
                const error = new Error('No Routes defined for this Endpoint');
                error.status = 404;
                console.log("[unhandledRoutes error - app.js]",error)
                next(error);
            })

            //Response for Error
            app.use((error, req, res, next) => {
                console.log("[use error - app.js]",error)
                res.status(error.status || 500)
            })
        }
    }

    return { create, start };
}