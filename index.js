'use strict';

const { utilitas } = require('utilitas');
const starlink = require('starlinkapi');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const moment = require('moment');
const slss = require('./lib/slss');

const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
const pdTime = (time) => { return utilitas.ensureInt(time, { pad: 2 }); };
const initData = () => { return { x: [], y: [] }; };
const fmSpeed = (b) => { return Math.round((b || 0) / 10000) / 100 || '0.00'; };
const status = [];
const curStars = [];
const maxStatus = 100;

let satellites = [];
let idxSatellites = 0;

const axisTime = (time) => {
    const t = new Date(time);
    return [t.getHours(), t.getMinutes(), t.getSeconds()].map(pdTime).join(':');
};

const getMaxMin = (data, percent) => {
    data = percent ? [100, 0] : data;
    let [max, min] = [Math.max.apply(null, data), Math.min.apply(null, data)];
    const spc = (max - min) / 4;
    max = Math.round(max + spc);
    min = Math.round(min - spc);
    return [max, min > 0 ? min : 0];
};

const infoLog = grid.set(0, 0, 4, 4, contrib.markdown, {
    fg: 'green', selectedFg: 'green', label: 'Starlink'
});

const obstructedLine = grid.set(0, 4, 4, 2, contrib.line, {
    label: 'Fraction Obstructed (%)',
    style: { line: 'yellow', text: 'green', baseline: 'black' },
    xLabelPadding: 3,
    wholeNumbersOnly: false,
    xPadding: 5,
});

const wedgeLine = grid.set(0, 6, 4, 2, contrib.line, {
    label: 'Wedge Obstructed',
    style: { line: 'yellow', text: 'green', baseline: 'black' },
    xLabelPadding: 3,
    wholeNumbersOnly: false,
    xPadding: 5,
});

const starMap = grid.set(0, 8, 4, 4, contrib.map, { label: 'Satellites' });

const pingLine = grid.set(4, 0, 6, 4, contrib.line, {
    label: 'Ping Success (%)',
    style: { line: 'yellow', text: 'green', baseline: 'black' },
    xLabelPadding: 3,
    wholeNumbersOnly: false,
    xPadding: 5,
});


const latencyLine = grid.set(4, 4, 6, 4, contrib.line, {
    label: 'Latency (ms)',
    style: { line: 'yellow', text: 'green', baseline: 'black' },
    xLabelPadding: 3,
    wholeNumbersOnly: false,
    xPadding: 5,
});

const snrLine = grid.set(4, 8, 4, 4, contrib.line, {
    label: 'SNR',
    style: { line: 'yellow', text: 'green', baseline: 'black' },
    xLabelPadding: 3,
    wholeNumbersOnly: false,
    xPadding: 5,
});

const throughputSpark = grid.set(8, 8, 2, 4, contrib.sparkline, {
    label: 'Throughput (bits/sec)'
    , tags: true
    , style: { fg: 'blue' }
});

const logsLog = grid.set(10, 0, 2, 12, contrib.log, {
    fg: "green"
    , selectedFg: "green"
    , label: 'Logs'
    ,
});

const renderInfoLog = () => {
    const stat = status[status.length - 1];
    if (!stat) { return; }
    const [log, arrLog] = [{
        'Device ID': stat.deviceInfo.id,
        'Hardware Version': stat.deviceInfo.hardwareVersion,
        'Software Version': stat.deviceInfo.softwareVersion,
        'Country Code': stat.deviceInfo.countryCode,
        'Uptime': moment(Date.now() - stat.deviceState.uptimeS * 1000).fromNow().replace(/ago$/i, ''),
        'State': stat.state,
        'Currently Obstructed': !!stat.obstructionStats?.currentlyObstructed,
        'Obstructed Time': Math.round((stat.deviceState.uptimeS - (stat?.obstructionStats?.validS || 0)) / stat.deviceState.uptimeS * 100 * 100) / 100 + ' %',
        'Last 24 Hour Obstructed': moment(Date.now() - (stat?.obstructionStats?.last24hObstructedS || 0) * 1000).fromNow().replace(/ago$/i, ''),


    }, []];
    for (let i in log) { arrLog.push(`${i}: ${log[i]}`); }
    infoLog.setMarkdown(arrLog.join('\n'));
};

const renderObstructedLine = () => {
    const data = initData();
    status.map(item => {
        data.x.push(axisTime(item.time));
        data.y.push((item?.obstructionStats?.fractionObstructed || 0) * 100);
    });
    const [maxY, minY] = getMaxMin(null, true);
    obstructedLine.options.maxY = maxY;
    obstructedLine.options.minY = minY;
    obstructedLine.setData(data);
    obstructedLine.screen.render();
};

const renderWedgeLine = () => {
    const stat = status[status.length - 1];
    if (!stat) { return; }
    const [wedge, wedgeAbs] = [{ label: 'WEDGE', x: [], y: [] }, { label: 'WEDGE ABS', x: [], y: [] }];
    for (let i in stat?.obstructionStats?.wedgeFractionObstructed) {
        wedge.y.push(stat.obstructionStats.wedgeFractionObstructed[i] * 100);
    }
    for (let i in stat?.obstructionStats?.wedgeAbsFractionObstructed) {
        wedgeAbs.y.push(stat.obstructionStats.wedgeAbsFractionObstructed[i] * 100);
    }
    wedge.x = wedgeAbs.x = ['N', 'N', 'E', 'E', 'E', 'S', 'S', 'S', 'W', 'W', 'W', 'N'];
    const [maxY1, minY1] = getMaxMin(wedge.y);
    const [maxY2, minY2] = getMaxMin(wedgeAbs.y);
    const maxY = Math.max(maxY1, maxY2);
    const minY = Math.min(minY1, minY2);
    wedgeLine.options.maxY = maxY;
    wedgeLine.options.minY = minY;
    wedgeLine.setData([wedge, wedgeAbs]);
    wedgeLine.screen.render();
};

const renderPingLine = () => {
    const data = initData();
    status.map(item => {
        data.x.push(axisTime(item.time));
        data.y.push((1 - Number(item.popPingDropRate || 0)) * 100);
    });
    const [maxY, minY] = getMaxMin(null, true);
    pingLine.options.maxY = maxY;
    pingLine.options.minY = minY;
    pingLine.setData(data);
    pingLine.screen.render();
};

const renderStarMap = () => {
    idxSatellites = idxSatellites >= satellites.length ? 0 : idxSatellites;
    if (satellites[idxSatellites]) { curStars.push(satellites[idxSatellites]); }
    idxSatellites++;
    while (curStars.length > maxStatus) { curStars.shift(); }
    starMap.clearMarkers();
    curStars.map(x => {
        starMap.addMarker({ lon: x.lng, lat: x.lat, color: 'red', char: '*' });
    });
};

const renderLatencyLine = () => {
    const data = initData();
    status.map(item => {
        data.x.push(axisTime(item.time));
        data.y.push(Number(item.popPingLatencyMs || 0));
    });
    const [maxY, minY] = getMaxMin(data.y);
    latencyLine.options.maxY = maxY;
    latencyLine.options.minY = minY;
    latencyLine.setData(data);
    latencyLine.screen.render();
};

const renderSnrLine = () => {
    const data = initData();
    status.map(item => {
        data.x.push(axisTime(item.time));
        data.y.push(Number(item.snr || 0));
    });
    const [maxY, minY] = getMaxMin(data.y);
    snrLine.options.maxY = maxY;
    snrLine.options.minY = minY;
    snrLine.setData(data);
    snrLine.screen.render();
};

const renderThroughputSpark = () => {
    const [download, upload] = [[], []];
    status.map(item => {
        download.push(Number(item.downlinkThroughputBps || 0));
        upload.push(Number(item.uplinkThroughputBps || 0));
    });
    throughputSpark.setData([
        `Download Usage ${fmSpeed(download[download.length - 1])} Mbps`,
        `Upload Usage ${fmSpeed(upload[upload.length - 1])} Mbps `,
    ], [download, upload]);
};

const renderLogsLog = () => {
    const stat = status[status.length - 1];
    if (!stat) { return; }
    logsLog.log(JSON.stringify(stat));
};

const renderAll = (resp) => {
    if (resp) { status.push(resp); }
    while (status.length > maxStatus) { status.shift(); }
    renderInfoLog();
    renderObstructedLine();
    renderWedgeLine();
    renderStarMap();
    renderPingLine();
    renderLatencyLine();
    renderSnrLine();
    renderThroughputSpark();
    renderLogsLog();
};

(async () => {
    await slss.watchStatus(renderAll);
    satellites = await starlink.satellites();
})();
