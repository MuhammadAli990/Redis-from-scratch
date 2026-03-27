import fs from "fs";
import store from "./store.js";
import { storeMeta } from "./store.js";
import { SNAPSHOT_FILE } from "./store.js";


export function getSize(obj) {
    return Buffer.byteLength(JSON.stringify(obj), 'utf8');
}


// TODO: check maximum size before loading snapshot (can be a true vulnerabilty for real systems)
export function loadSnapshot() {
    if (!fs.existsSync(SNAPSHOT_FILE)) return;

    const data = fs.readFileSync(SNAPSHOT_FILE, "utf-8");
    const parsed = JSON.parse(data);

    storeMeta.CURRENT_STORE_SIZE = 0;

    for (const key in parsed) {
        const entry = parsed[key];
        store.set(key, entry);
        const size = entry.size;
        storeMeta.CURRENT_STORE_SIZE += size;
    }

    console.log("Snapshot loaded, size:", storeMeta.CURRENT_STORE_SIZE, "bytes");
}