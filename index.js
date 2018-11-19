var express = require('express');
var socket = require('socket.io');
var SocketIOFile = require('socket.io-file');

//app setup
var app = express();
var server = app.listen(3000, function(){
	console.log('listening on port 3000');
});

//static files
app.use(express.static('public'));


app.get('/', (req, res, next) => {
	return res.sendFile(__dirname + '/client/index.html');
});

app.get('/chat.js', (req, res, next) => {
	return res.sendFile(__dirname + '/client/chat.js');
});

app.get('/socket.io.js', (req, res, next) => {
	return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

app.get('/socket.io-file-client.js', (req, res, next) => {
	return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
});



//socket setup
var io = socket(server);

io.on('connection', function(socket){
	console.log('connection made', socket.id);

	socket.on('chat', function(data){
		io.sockets.emit('chat', data);
	});


	var uploader = new SocketIOFile(socket, {

        uploadDir: 'data',
        maxFileSize: 4194304, // 4MB
        chunkSize: 10240, // 1KB
        transmissionDelay: 0,
        overwrite: true
    });


    uploader.on('start', (fileInfo) => {
        console.log('Start uploading');
        console.log(fileInfo);
    });
    uploader.on('stream', (fileInfo) => {
        console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
    });
    uploader.on('complete', (fileInfo) => {
        console.log('Upload Complete.');
        console.log(fileInfo);
    });
    uploader.on('error', (err) => {
        console.log('Error!', err);
    });
    uploader.on('abort', (fileInfo) => {
        console.log('Aborted: ', fileInfo);
    });

});