'use strict';

const { utilitas } = require('utilitas');
const func = require('../lib/func');

const ignore = [
    'killed', 'code', 'signal', 'cmd', 'stdout',
    'stderr', 'deviceInfo', 'obstructionStats'
];

module.exports = {
    layout: [10, 0, 2, 12],
    type: 'log',
    config: { fg: 'green', selectedFg: 'green', label: 'Logs' },
    render: (sus, instant) => {
        let s = func.getLastAntenna(sus, 'logs');
        if (!s) { return; }
        if (utilitas.isError(s)) {
            s = { time: new Date(), ...s, message: s.stderr || s.message };
        }
        const l = JSON.parse(JSON.stringify(s));
        ignore.map(x => { try { delete l[x]; } catch (e) { } });
        instant.log(JSON.stringify(l));
    },
};
