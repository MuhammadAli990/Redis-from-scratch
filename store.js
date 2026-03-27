const store = new Map();

export const storeMeta = {
    CURRENT_STORE_SIZE:0,
    MAX_STORE_SIZE:10 * 1024 * 1024 // 10 MB
};

export const SNAPSHOT_FILE = "./snapshot.json";

export default store;