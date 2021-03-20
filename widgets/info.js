'use strict';

const moment = require('moment');
const func = require('../lib/func');

const formatPercent = (num) => { return Math.round(num * 100) / 100 + ' %'; };

const formatTime = (t) => {
    return moment(Date.now() - (t || 0) * 1000).fromNow().replace(/ ago$/i, '');
};

module.exports = {
    layout: [0, 0, 4, 4],
    type: 'markdown',
    config: {
        fg: 'green', selectedFg: 'green', label: 'Starlink'
    },
    render: (status, instant) => {
        const stat = func.getLastAntenna(status);
        if (!stat) { return; }
        const u = stat.deviceState.uptimeS;
        const o = stat?.obstructionStats;
        const [log, arrLog] = [{
            'Device ID': stat.deviceInfo.id,
            'Hardware Version': stat.deviceInfo.hardwareVersion,
            'Software Version': stat.deviceInfo.softwareVersion,
            'Country Code': stat.deviceInfo.countryCode,
            'Uptime': formatTime(u),
            'State': stat.state,
            'Currently Obstructed': !!o?.currentlyObstructed,
            'Obstructed Time': formatPercent((u - (o?.validS || 0)) / u * 100),
            'Last 24 Hour Obstructed': formatTime(o?.last24hObstructedS),
        }, []];
        for (let i in log) { arrLog.push(`${i}: ${log[i]}`); }
        instant.setMarkdown(arrLog.join('\n'));
    },
};
