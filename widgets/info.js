'use strict';

module.exports = {
    layout: [0, 0, 4, 4],
    type: 'markdown',
    config: {
        fg: 'green', selectedFg: 'green', label: 'Starlink'
    },
    render: (status, _, widget) => {
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
        widget.setMarkdown(arrLog.join('\n'));
    },
};
