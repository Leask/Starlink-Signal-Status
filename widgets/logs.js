'use strict';

const func = require('../lib/func');

module.exports = {
    layout: [10, 0, 2, 12],
    type: 'log',
    config: { fg: 'green', selectedFg: 'green', label: 'Logs' },
    render: (status, instant) => {
        const stat = func.getLastAntenna(status);
        if (!stat) { return; }
        instant.log(JSON.stringify(stat));
    },
};
