'use strict';

const func = require('../lib/func');

module.exports = {
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
        const data = func.initData();
        status.antenna.map(item => {
            data.x.push(func.axisTime(item.time));
            data.y.push(Number(item.snr || 0));
        });
        [instant.options.maxY, instant.options.minY] = func.getMaxMin(data.y);
        instant.setData(data);
    },
};
