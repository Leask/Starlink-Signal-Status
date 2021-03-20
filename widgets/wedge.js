'use strict';

const func = require('../lib/func');

const directions = ['N', 'N', 'E', 'E', 'E', 'S', 'S', 'S', 'W', 'W', 'W', 'N'];

module.exports = {
    layout: [0, 6, 4, 2],
    type: 'line',
    config: {
        label: 'Wedge Obstructed',
        style: { line: 'yellow', text: 'green', baseline: 'black' },
        xLabelPadding: 3,
        wholeNumbersOnly: false,
        xPadding: 5,
    },
    render: (status, instant) => {
        const stat = func.getLastAntenna(status);
        if (!stat) { return; }
        const [o, data] = [stat?.obstructionStats, [
            { label: 'WEDGE', x: directions, y: [] },
            { label: 'WEDGE ABS', x: directions, y: [] },
        ]];
        for (let i in o?.wedgeFractionObstructed) {
            data[0].y.push(Number(o.wedgeFractionObstructed[i] || 0) * 100);
        }
        for (let i in o?.wedgeAbsFractionObstructed) {
            data[1].y.push(Number(o.wedgeAbsFractionObstructed[i] || 0) * 100);
        }
        const [maxY1, minY1] = func.getMaxMin(data[0].y);
        const [maxY2, minY2] = func.getMaxMin(data[1].y);
        instant.options.maxY = Math.max(maxY1, maxY2);
        instant.options.minY = Math.min(minY1, minY2);
        instant.setData(data);
    },
};
