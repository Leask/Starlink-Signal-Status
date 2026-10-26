import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { axisTime, getLastAntenna, getMaxMin } from '../lib/func.mjs';
import { fileType, utilitas, uuid } from 'utilitas';
import { satellites } from 'starlinkapi';
import blessed from 'blessed';
import contrib from 'blessed-contrib';

test('dashboard dependencies support the current Node runtime', async () => {
    assert.equal(typeof blessed.screen, 'function');
    assert.equal(typeof contrib.grid, 'function');
    assert.equal(typeof satellites, 'function');
    assert.equal(utilitas.ensureInt(3, { pad: 2 }), '03');
    assert.match(uuid.v4(), /^[0-9a-f-]{36}$/);
    const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64');
    assert.equal((await fileType.fileTypeFromBuffer(gif)).mime, 'image/gif');
});

test('status helpers preserve telemetry values', () => {
    const time = new Date(2026, 0, 1, 3, 4, 5);
    assert.equal(axisTime(time), '03:04:05');
    assert.deepEqual(getMaxMin([10, 30]), [35, 5]);
    assert.equal(getLastAntenna({ antenna: ['old', 'new'] }), 'new');
});

for (const name of await readdir(new URL('../widgets/', import.meta.url))) {
    if (!name.endsWith('.mjs')) { continue; }
    test(`widget loads: ${name}`, async () => {
        const widget = await import(new URL(`../widgets/${name}`, import.meta.url));
        assert.equal(typeof contrib[widget.type], 'function');
        assert.equal(typeof widget.render, 'function');
        assert.equal(widget.layout.length, 4);
    });
}
