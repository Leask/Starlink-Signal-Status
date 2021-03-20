'use strict';

const fmSpeed = (b) => { return Math.round((b || 0) / 10000) / 100 || '0.00'; };

module.exports = {
    layout: [8, 8, 2, 4],
    type: 'sparkline',
    config: {
        label: 'Throughput (bits/sec)', tags: true, style: { fg: 'blue' }
    },
    render: (status, instant) => {
        const data = [[], []];
        status.antenna.map(item => {
            data[0].push(Number(item.downlinkThroughputBps || 0));
            data[1].push(Number(item.uplinkThroughputBps || 0));
        });
        instant.setData([
            `Download Usage ${fmSpeed(data[0][data[0].length - 1])} Mbps`,
            `Upload Usage ${fmSpeed(data[1][data[1].length - 1])} Mbps `,
        ], data);
    },
};
