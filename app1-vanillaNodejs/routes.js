const fs = require('fs'); // to work with the file system

const requestHandler = (req, res) => {

	// console.log(req);
	// process.exit();
	// console.log(req.url, req.method, req.headers);

	const url = req.url;
	const method = req.method;

	if(url === '/') {

			// writes in chunks
			res.write('<html>');
			res.write('<head><title>Enter Message</title></head>');
			res.write('<body>');
			res.write('<h1>Enter message</h1>');
			res.write('<form action="/message" method="POST"><input name="message" type="text"><button type="submit">Send</button></input></form>');
			res.write('</body>');
			res.write('</html>');
			return res.end(); //this is to return from the function and not for the purpose of returning res.end()
		
		}
		
		if (url === '/message' && method === "POST") {

			const body = [];

			// incoming data is sent as a stream of data. stream is an ongoing process. requests are read in chunks.
			// we can start working on chunks without full request being read(fully parsed). node handles requests
			// this way as it doesnt know in advance how complex/big data might be, so it can start processing on chunks.
			// Buffer - a construct which allow you to hold multiple chunks and work with them before they are released.
			
		    req.on('data', (chunk) => { // a listener - fired whenever a new chunk is ready to be read
		      console.log(chunk);
		      body.push(chunk);
		    });

		    // listeners are non-blocking code
		    
		    return req.on('end', () => {  // triggered when nodejs is done parsing the request - it sends the 'end' event and the function executes
		      
		      const parsedBody = Buffer.concat(body).toString();  // create a new buffer and add all chunks to it
		      // console.log(parsedBody);
		      const message = parsedBody.split('=')[1];
		      // fs.writeFileSync('message.txt', message); //create and write to file
		      // // sync means synchronus, so this method(instead of just writeFile()) will 'block' further execution until the file is created.
		      // should use writeFile() as file operation may be large, it takes a callback to execute when the operation is done
		      
		      //listener inside listener - event driven architecture
		      fs.writeFile('message.txt', message, err => { // only send the response if we are done with the file
		        res.statusCode = 302; //redirect
		        res.setHeader('Location', '/');
		        return res.end();
		      });

		    });

		}

		// sending response doesnt mean event listeners are dead, they will still execute even if response is already gone
	    // we are passing functions to listeners which node executes at a later point of time asynchronously.
		// the listeners are only registered internally and the functions passed to them are not immediately executed and
		// are only registered in nodejs's event emitter registry.

		res.setHeader('Content-Type', 'text/html'); // pass meta information saying type of content that is part of response is html
		// some more default headers are set by the browser automatically
		
		// writes in chunks
		res.write('<html>');
		res.write('<body>');
		res.write('<h1>Hello from Nodejs Server</h1>');
		res.write('</body>');
		res.write('</html>');
		res.end(); //can't write anymore after this, it returns the response

}

// module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'Some hard coded text'
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some text';

exports.handler = requestHandler;

