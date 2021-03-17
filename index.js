'use strict';

const starlink = require('./lib/starlink');

(async () => {
    // const a = await starlink.getStatus();
    // console.log(a);
    await starlink.watchStatus();
})();
