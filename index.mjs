#!/usr/bin/env node

import { join } from 'path';
import { maxStatus } from './lib/func.mjs';
import { readdirSync } from 'fs';
import { satellites } from 'starlinkapi';
import { utilitas } from 'utilitas';
import { watchStatus } from './lib/slss.mjs';
import blessed from 'blessed';
import contrib from 'blessed-contrib';

const { __dirname } = utilitas.__(import.meta.url);
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
const widgetsPath = join(__dirname, 'widgets');
const widgets = {};
const status = { antenna: [], satellites: [], logs: [], iS: 0, cS: [] };

const widgetFiles = (readdirSync(widgetsPath) || []).filter(
    file => /\.mjs$/i.test(file) && file.indexOf('.') !== 0
);

for (let file of widgetFiles) {
    const name = file.replace(/^(.*)\.mjs$/i, '$1');
    widgets[name] = { ...await import(join(widgetsPath, file)) };
    widgets[name].instant = grid.set(
        widgets[name].layout[0], widgets[name].layout[1],
        widgets[name].layout[2], widgets[name].layout[3],
        contrib[widgets[name].type], widgets[name].config
    );
}

const renderAll = (resp, err) => {
    resp && status.antenna.push(resp);
    (resp || err) && status.logs.push(resp || err);
    while (status.antenna.length > maxStatus) { status.antenna.shift(); }
    for (let i in widgets) { widgets[i].render(status, widgets[i].instant); };
    screen.render();
};

screen.key(['escape', 'q', 'C-c'], function(c, k) { return process.exit(0); });

screen.on('resize', function(e) {
    for (let i in widgets) { widgets[i].instant.emit('attach'); };
    renderAll();
});

await watchStatus(renderAll);
status.satellites = await satellites();
