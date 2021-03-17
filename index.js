'use strict';

const starlink = require('./lib/starlink');
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
const status = [];
const maxStatus = 100;

const pingLine = grid.set(0, 0, 10, 12, contrib.line, {
    label: 'Ping',
    style: { line: 'yellow', text: 'green', baseline: 'black' },
    xLabelPadding: 3,
    wholeNumbersOnly: false,
    xPadding: 5,
});

const lpTime = (time) => { return time > 9 ? String(time) : `0${time}`; };

const axisTime = (time) => {
    const objTime = new Date(time);
    return lpTime(objTime.getHours()) + ':' + lpTime(objTime.getMinutes());
};

const getMaxMin = (data, fixMax, fixMin) => {
    let [max, min] = [
        fixMax ?? Math.max.apply(null, data),
        fixMin ?? Math.min.apply(null, data),
    ];
    const len = max - min;
    const spc = len / 4;
    max = Math.round(max + spc);
    min = Math.round(min - spc);
    min = min > 0 ? min : 0;
    return [max, min];
};

const processData = () => {
    let [data, maxY, minY] = [{ x: [], y: [] }, null, null];
    status.map(item => {
        data.x.push(axisTime(item.time));
        data.y.push((1 - Number(item.popPingDropRate || 0)) * 100);
    });
    [maxY, minY] = getMaxMin(data.y, 100, 0);
    return [data, maxY, minY];
};

const renderPingLine = () => {
    const [data, maxY, minY] = processData();
    pingLine.options.maxY = maxY;
    pingLine.options.minY = minY;
    pingLine.setData(data);
    pingLine.screen.render();
};

const renderAll = (resp) => {
    if (resp) { status.push(resp); }
    while (status.length > maxStatus) { status.shift(); }
    renderPingLine();
};

(async () => {
    // const a = await starlink.getStatus();
    // console.log(a);
    await starlink.watchStatus(renderAll);
})();
