import net from "net";
import { set, get, deleteKey} from "./controller.js";
import { expirationScheduler, snapshotScheduler} from "./schedulers.js";
import { loadSnapshot } from "./helper.js";

expirationScheduler();
snapshotScheduler();
loadSnapshot();

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const input = data.toString().trim();
        const [command, key, value, ttl] = input.split(" ");

        switch (command.toUpperCase()) {
            case "SET":
                set(key, value, Number(ttl));
                socket.write("OK\n");
                break;

            case "GET":
                const result = get(key);
                socket.write((result ?? "null") + "\n");
                break;

            case "DEL":
                deleteKey(key);
                socket.write("OK\n");
                break;

            case "PING":
                socket.write("PONG\n");
                break;

            default:
                socket.write("UNKNOWN COMMAND\n");
        }
    });
});

server.listen(6379, () => {
    console.log("Server running on port 6379");
});