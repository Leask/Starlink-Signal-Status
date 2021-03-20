'use strict';

const func = require('../lib/func');

module.exports = {
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
        const data = func.initData();
        status.antenna.map(x => {
            data.x.push(func.axisTime(x.time));
            data.y.push((x?.obstructionStats?.fractionObstructed || 0) * 100);
        });
        [instant.options.maxY, instant.options.minY] = func.getMaxMin(null, 1);
        instant.setData(data);
    },
};
