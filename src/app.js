const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },
    { name: 'port', alias: 'p', type: Number}
]

const options = commandLineArgs(optionDefinitions);

const port = options.port || process.env.BADGE_PORT || 8080;
const verbose = options.verbose;

const server =  require('./server.js');
server(port, verbose);
