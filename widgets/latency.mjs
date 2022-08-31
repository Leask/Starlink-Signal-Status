import { axisTime, getMaxMin, initData } from '../lib/func.mjs';

export const { layout, type, config, render } = {
    layout: [4, 4, 6, 4],
    type: 'line',
    config: {
        label: 'Latency (ms)',
        style: { line: 'yellow', text: 'green', baseline: 'black' },
        xLabelPadding: 3,
        wholeNumbersOnly: false,
        xPadding: 5,
    },
    render: (status, instant) => {
        const data = initData();
        status.antenna.map(item => {
            data.x.push(axisTime(item.time));
            data.y.push(Number(item.popPingLatencyMs || 0));
        });
        [instant.options.maxY, instant.options.minY] = getMaxMin(data.y);
        instant.setData(data);
    },
};
