/**
 * Created by harekam on 27/08/15.
 */
var Hapi = require('hapi');
var Path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger('[SERVER]');
var Plugins = require('./plugins');
var config = require('./config');
var routes = require('./routes');
var models = require('./models');
var ModelsManager = require('./models/initModels');
var TwitterManager = require('./libraries/TwitterManager');
var PORT = config.serverConfig.PORT.LIVE;

/**
 * Server Config
 */
var server = new Hapi.Server({
    app: {
        name: config.serverConfig.APP_NAME
    }
});

var connectionOptions = {
    port: PORT,
    routes: {
        cors: true,
        files: {relativeTo: Path.join(__dirname, 'public')}
    }
};

server.connection(connectionOptions);

/**
 * Plugins
 */
server.register(Plugins, function (err) {
    if (err) {
        server.error('Error while loading plugins : ' + err)
    } else {
        server.log('info', 'Plugins Loaded')
    }
});
// API Routes
routes.forEach(function (api) {
    server.route(api);
});

ModelsManager.init(models, function (error) {
    if (error)
        logger.error(error);
    //process.exit(1);

});
TwitterManager.init();
//
// Start the server
server.start(function () {
    server.log('Server running at:', server.info.uri);
});
