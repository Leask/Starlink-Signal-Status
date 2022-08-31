import { getLastAntenna } from '../lib/func.mjs';
import moment from 'moment';

const formatPercent = num => Math.round(num * 100) / 100 + ' %';
const formatTime = t => moment(Date.now() - (t || 0) * 1000).fromNow().replace(/ ago$/i, '');

export const { layout, type, config, render } = {
    layout: [0, 0, 4, 4],
    type: 'markdown',
    config: { fg: 'green', selectedFg: 'green', label: 'Starlink' },
    render: (status, instant) => {
        const stat = getLastAntenna(status);
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
