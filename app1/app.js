// Write our own server - raw logic without using framework like express

const http = require('http'); //import http module (automatically puts .js after it)

const routes = require('./routes'); // import requestHandler from routes.js
// can only export to read from it, can't edit anything from here directly

// event loop keeps on running as long as there is work to do i.e as long as there are
// event listeners registered. createServer creates a listener which never stops unless
// we force it using process.exit()

const server = http.createServer(routes.handler);

server.listen(3000); // node will listen for incoming requests at port 3000

/* 
event loop is automatically started when the code is run. it is responsible for handling event callbacks.
event loop runs the code inside callbacks when that event is encountered. 
the file operation in code above is not handled by event loop, just the callback defined on writeFile() 
once its done. File system operations and other long taking operations are sent to a worker pool also managed
by nodejs. It does all heavy lifting, detached from JS. It runs on separate threads and can use multithreading 
by intervening with the OS. Its totally detached from code, requesr and event loop. Once worker is done, it will
trigger callback, which will end up in the event loop.
Event loop keeps on looping, at beginning of each iteration it checks if there are any timer callbacks(like setTimeout)
that it should execute. Then it checks other callbacks like the ones passed to writeFile(). If they are long operations,
nodejs will leave that phase after certain time and also if too many outstanding callbacks, it continues its loop iteration
and postpone these callbacks to next iteration to execute them. After finishing all these callbacks, it enters a 'Poll' phase
where nodejs will look for new I/O events(Disk & Network - blocking operations) and execute their callbacks also. If thats not
possible, it will defer the execution and basically register it as a pending callback. It checks if any timer callbacks, if yes,
it jumps to them and execute them right away, so it can jump back and not finish the iteration. Otherwise it continues and next 
'set' immediate callbacks are executed in 'Check' phase. Set immediate is like setInterval but just that its executed immediately, 
but always after any open callbacks have been executed. Then finally it executes all 'close' event callbacks.
Timer callbacks -> I/O related callbacks -> other events -> setImmediate() callbacks -> close event callbacks
Then we might exit the nodejs program, but only if there are no remaining registered event listeners ( refs == 0).
createServer() listens to incoming requests, so there is always one listener and refs is not 0, so we don't exit.
Can exit forcefully using process.exit().
There is separation between each request as the function passed inside createServer() runs for each incoming request, and anything
we do the request or response object there will not be exposed to other response objects because each function is only scoped to itself
so by default we have a separation between requests. 


Phases Overview
timers: this phase executes callbacks scheduled by setTimeout() and setInterval().
pending callbacks: executes I/O callbacks deferred to the next loop iteration.
idle, prepare: only used internally.
poll: retrieve new I/O events; execute I/O related callbacks (almost all with the 
	  exception of close callbacks, the ones scheduled by timers, and setImmediate()); 
	  node will block here when appropriate.
check: setImmediate() callbacks are invoked here.
close callbacks: some close callbacks, e.g. socket.on('close', ...).


Each phase has a FIFO queue of callbacks to execute. While each phase is special in its 
own way, generally, when the event loop enters a given phase, it will perform any operations 
specific to that phase, then execute callbacks in that phase's queue until the queue has been 
exhausted or the maximum number of callbacks has executed. When the queue has been exhausted 
or the callback limit is reached, the event loop will move to the next phase, and so on.
*/