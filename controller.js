import store from "./store.js";
import { getSize } from "./helper.js";
import { storeMeta } from "./store.js";

const defaultTTL = 2 * 60 * 1000;

export function set(key, value, ttl) {
    if(ttl !== NaN || ttl===undefined){ // as NaN !== NaN
        ttl = defaultTTL;
    }
    const expiresAt = Date.now() + ttl;
    const size = getSize({ key, value, expiresAt });

    const entry = { value, expiresAt, size };

    // if key already exists then subtract old size
    if (store.has(key)) {
        const oldEntry = store.get(key);
        storeMeta.CURRENT_STORE_SIZE -= oldEntry.size;
    }

    // insert new entry
    store.set(key, entry);
    storeMeta.CURRENT_STORE_SIZE += size;

    // FIFO if store exceeds max size
    while (storeMeta.CURRENT_STORE_SIZE > storeMeta.MAX_STORE_SIZE) {
        const oldestKey = store.keys().next().value;
        const oldestEntry = store.get(oldestKey);

        storeMeta.CURRENT_STORE_SIZE -= oldestEntry.size;
        store.delete(oldestKey);
    }

    console.log(
        `Key set: ${key}, size: ${size} bytes, total size: ${storeMeta.CURRENT_STORE_SIZE} bytes`
    );
}


export function get(key) {
    const entry = store.get(key);

    if (!entry) {
        return null;
    }

    // lazy deletion
    if (Date.now() > entry.expiresAt) {
        store.delete(key);
        storeMeta.CURRENT_STORE_SIZE -= entry.size;
        return null;
    }

    return entry.value;
}


export function deleteKey(key) {
    const entry = store.get(key);

    if (entry) {
        storeMeta.CURRENT_STORE_SIZE -= entry.size;
        store.delete(key);
    }
}


export function clear() {
    store.clear();
    storeMeta.CURRENT_STORE_SIZE = 0;
}