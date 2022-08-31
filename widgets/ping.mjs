import { axisTime, getMaxMin, initData } from '../lib/func.mjs';

export const { layout, type, config, render } = {
    layout: [4, 0, 6, 4],
    type: 'line',
    config: {
        label: 'Ping Success (%)',
        style: { line: 'yellow', text: 'green', baseline: 'black' },
        xLabelPadding: 3,
        wholeNumbersOnly: false,
        xPadding: 5,
    },
    render: (status, instant) => {
        const data = initData();
        status.antenna.map(item => {
            data.x.push(axisTime(item.time));
            data.y.push((1 - Number(item.popPingDropRate || 0)) * 100);
        });
        [instant.options.maxY, instant.options.minY] = getMaxMin(null, 1);
        instant.setData(data);
    },
};
