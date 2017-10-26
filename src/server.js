const express = require('express');
const bodyParser = require('body-parser');

const getLink = require('./badger.js');
const {getLastValue, storeBadge} = require('./store.js');
const fs = require('fs');

const types = {
    'eslint-errors': require('../templates/eslint-errors'),
    'eslint-warnings': require('../templates/eslint-warnings'),
    'flow-coverage': require('../templates/flow-coverage'),
    'vue-component': require('../templates/vue-component-decorator')
}

module.exports = function createApp(port, verbose) {
    const app = express();
    app.use(bodyParser.json());
    app.get('/:badgeType/:project', (req, res) => {
        const badgeType = req.params.badgeType;
        const project = req.params.project;

        const lastValue = getLastValue(badgeType, project);
        const badgeHandler = types[req.params.badgeType];
        const badgeData = badgeHandler(lastValue);
        const badge = getLink(badgeData);
        return res.send(badge);
    });
    
    app.post('/:badgeType/:project', (req, res) => {
        const value = req.body.value;
        const badgeHandler = types[req.params.badgeType];
        storeBadge(req.params.badgeType, req.params.project, value);
        if (badgeHandler) {
            const meta = badgeHandler(value);
            const badge = getLink(meta);
            return res.send(badge);
        } else {
            return res.status(400).json(Object.keys(types));
        }
    });

    app.get('/', (req, res) => {
        return res.json(Object.keys(types));
    })
    
    app.listen(port, (err) => {
        if (err) {
            console.error(err);
        }
        console.log('started');
    });

    return app;
}