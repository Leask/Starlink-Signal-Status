import { getLastAntenna } from '../lib/func.mjs';

const ignore = [
    'killed', 'code', 'signal', 'cmd', 'stdout',
    'stderr', 'deviceInfo', 'obstructionStats'
];

export const { layout, type, config, render } = {
    layout: [10, 0, 2, 12],
    type: 'log',
    config: { fg: 'green', selectedFg: 'green', label: 'Logs' },
    render: (sus, instant) => {
        let s = getLastAntenna(sus, 'logs');
        if (!s) { return; }
        if (Error.isError(s)) {
            s = { time: new Date(), ...s, message: s.stderr || s.message };
        }
        const l = JSON.parse(JSON.stringify(s));
        ignore.map(x => { try { delete l[x]; } catch (e) { } });
        instant.log(JSON.stringify(l));
    },
};
