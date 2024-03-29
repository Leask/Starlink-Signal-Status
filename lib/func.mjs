import { utilitas } from 'utilitas';

const getLastAntenna = (a, f = 'antenna') => a[f][a[f].length - 1];
const initData = () => { return { x: [], y: [] }; };
const pdTime = (time) => utilitas.ensureInt(time, { pad: 2 });
const maxStatus = 100

const axisTime = (time) => {
    const t = new Date(time);
    return [t.getHours(), t.getMinutes(), t.getSeconds()].map(pdTime).join(':');
};

const getMaxMin = (data, percent) => {
    data = percent ? [100, 0] : data;
    let [max, min] = [Math.max.apply(null, data), Math.min.apply(null, data)];
    const spc = (max - min) / 4;
    max = Math.round(max + spc);
    min = Math.round(min - spc);
    return [max, min > 0 ? min : 0];
};

export {
    axisTime,
    getLastAntenna,
    getMaxMin,
    initData,
    maxStatus,
};
