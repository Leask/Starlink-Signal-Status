#!/usr/bin/env node

'use strict';

const starlink = require('starlinkapi');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const slss = require('./lib/slss');
const func = require('./lib/func');
const path = require('path');
const fs = require('fs');

const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
const widgetsPath = path.join(__dirname, 'widgets');
const widgets = {};
const status = { antenna: [], satellites: [], logs: [], iS: 0, cS: [] };

(fs.readdirSync(widgetsPath) || []).filter((file) => {
    return /\.js$/i.test(file) && file.indexOf('.') !== 0;
}).forEach((file) => {
    const name = file.replace(/^(.*)\.js$/i, '$1');
    widgets[name] = require(path.join(widgetsPath, file));
    widgets[name].instant = grid.set(
        widgets[name].layout[0], widgets[name].layout[1],
        widgets[name].layout[2], widgets[name].layout[3],
        contrib[widgets[name].type], widgets[name].config
    );
});

const renderAll = (resp, err) => {
    resp && status.antenna.push(resp);
    (resp || err) && status.logs.push(resp || err);
    while (status.antenna.length > func.maxStatus) { status.antenna.shift(); }
    for (let i in widgets) { widgets[i].render(status, widgets[i].instant); };
    screen.render();
};

screen.key(['escape', 'q', 'C-c'], function(c, k) { return process.exit(0); });

screen.on('resize', function(e) {
    for (let i in widgets) { widgets[i].instant.emit('attach'); };
    renderAll();
});

(async () => {
    await slss.watchStatus(renderAll);
    status.satellites = await starlink.satellites();
})();
