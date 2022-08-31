import { axisTime, getMaxMin, initData } from '../lib/func.mjs';

export const { layout, type, config, render } = {
    layout: [0, 4, 4, 2],
    type: 'line',
    config: {
        label: 'Fraction Obstructed (%)',
        style: { line: 'yellow', text: 'green', baseline: 'black' },
        xLabelPadding: 3,
        wholeNumbersOnly: false,
        xPadding: 5,
    },
    render: (status, instant) => {
        const data = initData();
        status.antenna.map(x => {
            data.x.push(axisTime(x.time));
            data.y.push((x?.obstructionStats?.fractionObstructed || 0) * 100);
        });
        [instant.options.maxY, instant.options.minY] = getMaxMin(null, 1);
        instant.setData(data);
    },
};
