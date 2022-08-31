import { axisTime, getMaxMin, initData } from '../lib/func.mjs';

export const { layout, type, config, render } = {
    layout: [4, 8, 4, 4],
    type: 'line',
    config: {
        label: 'SNR',
        style: { line: 'yellow', text: 'green', baseline: 'black' },
        xLabelPadding: 3,
        wholeNumbersOnly: false,
        xPadding: 5,
    },
    render: (status, instant) => {
        const data = initData();
        status.antenna.map(item => {
            data.x.push(axisTime(item.time));
            data.y.push(Number(item.snr || ~~item.isSnrAboveNoiseFloor * 100));
        });
        [instant.options.maxY, instant.options.minY] = getMaxMin(data.y, 1);
        instant.setData(data);
    },
};
