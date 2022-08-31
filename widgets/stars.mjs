import { maxStatus } from '../lib/func.mjs';

export const { layout, type, config, render } = {
    layout: [0, 8, 4, 4],
    type: 'map',
    config: { label: 'Satellites' },
    render: (sta, inst) => {
        sta.iS = sta.iS >= sta.satellites.length ? 0 : sta.iS;
        if (sta.satellites[sta.iS]) { sta.cS.push(sta.satellites[sta.iS]); }
        sta.iS++;
        while (sta.cS.length > maxStatus) { sta.cS.shift(); }
        inst.clearMarkers();
        sta.cS.map(x => {
            inst.addMarker({ lon: x.lng, lat: x.lat, color: 'red', char: '*' });
        });
    },
};
