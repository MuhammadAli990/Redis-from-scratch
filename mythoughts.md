System design:

api server (or simple tcp server)
receieves get, set, ping command

2 schedulers
one for taking snapshot (backup) and storing in storage
one for removing expired data

set ttl for every set operation (by default is 5 min)

memory limit 10mb for storing data (as data is in memory)
more than 10mb not means no more data.. it means remove the oldest entry

what data structure should we use for storing data?
js object?
map is better

lazy deletion in get method


### file structure:
- server.js -> opens a tcp server at 6379 to receive set,get etc requests
- controller.js -> has the code for set, get etc. functions
- schedulers.js -> has the code for 2 schedulers
- store.js -> contains store and its related data
- helper.js -> contains some helper functions (calculting data size, loading snapshot)
- snapshot.json -> backup snapshot file




### things to do:
- **COMPLETED** calculate size of every entry for one time only, so no expensive operation again and again
- **COMPLETED** set default ttl
- check snapshot data size with max_store_size before loading
- **COMPLETED** when loading snapshot, you can use already calculated sizes
- can implement LRU instead of fifo incase of memory limit exceed
- **leavethatshit** support multiple datatypes other than string
- EXISTS command

