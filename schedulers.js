import fs from "fs";
import store, { storeMeta } from "./store.js";
const SNAPSHOT_FILE = "./snapshot.json";

const EXPIRATION_CHECK_INTERVAL = 5; // minutes
const SNAPSHOT_INTERVAL = 5; // minutes

export function expirationScheduler() {
    setInterval(() => {
        const now = Date.now();
        console.log("Running expiration scheduler...");
        for (const [key, entry] of store.entries()) {
            if (now > entry.expiresAt || entry.expiresAt === null) {
                storeMeta.CURRENT_STORE_SIZE -= entry.size;
                store.delete(key);
            }
        }
    }, EXPIRATION_CHECK_INTERVAL * 60 * 1000);
}

export function snapshotScheduler() {
    setInterval(() => {
        const obj = Object.fromEntries(store);
        console.log("Running snapshot scheduler...");

        fs.writeFile(SNAPSHOT_FILE, JSON.stringify(obj), (err) => {
            if (err) {
                console.error("Snapshot failed:", err);
            } else {
                console.log("Snapshot saved");
            }
        });
    }, SNAPSHOT_INTERVAL * 60 * 1000);
}