import { event, shell, utilitas } from 'utilitas';

const grpcBin = 'grpcurl';
const apiRoot = '192.168.100.1:9200';
const apiStatus = 'SpaceX.API.Device.Device/Handle';
const getStatus = () => requestGrpc({ get_status: {} }, apiStatus);

const requestGrpc = async (data, api, root = apiRoot) => {
    assert(api, 'API is required.', 400);
    await shell.assertExist(grpcBin);
    const raw = await shell.exec(
        `${grpcBin} -v -plaintext -d '${JSON.stringify(data)}' ${root} ${api}`
    );
    let [found, resp] = [false, []];
    for (let line of raw.split('\n')) {
        if (line === 'Response contents:') {
            found = true; continue;
        } else if (line === 'Response trailers received:') { break; }
        if (line && found) { resp.push(line); }
    }
    try { resp = JSON.parse(resp.join('')); } catch (e) {
        utilitas.throwError('Error parsing gRPC response.', 500);
    }
    return resp;
};

const watchStatus = async (cb, i = 1, t = 1, d = 0, n = 'starlink', o = {}) => {
    return event.loop(async () => {
        let [resp, err] = [null, null];
        try {
            resp = { time: new Date(), ...(await getStatus()).dishGetStatus };
        } catch (e) { err = e; }
        cb ? await cb(resp, err) : console.log(err || resp);
    }, i, t, d, n, { silent: true, ...o });
};

export {
    getStatus,
    requestGrpc,
    watchStatus,
};
