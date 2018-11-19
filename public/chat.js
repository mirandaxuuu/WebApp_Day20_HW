var socket = io.connect('http://localhost:3000');
var uploader = new SocketIOFileClient(socket);

var message = document.getElementById('message');
	username = document.getElementById('username');
	btn = document.getElementById('send');
	btn2 = document.getElementById('upload');
	output = document.getElementById('output');

//emit events
btn.addEventListener('click', function(){
	socket.emit('chat', {
		message: message.value,
		username: username.value
	});
});

//listening for events
socket.on('chat', function(data){
	output.innerHTML += '<p><strong>' + data.username + ': </strong>' + data.message + '</p>';
});



uploader.on('start', function(fileInfo) {
    console.log('Start uploading', fileInfo);
});
uploader.on('stream', function(fileInfo) {
    console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
});
uploader.on('complete', function(fileInfo) {
    console.log('Upload Complete', fileInfo);
    var imageTitle = fileInfo.name;
	// console.log(imageTitle);
});
uploader.on('error', function(err) {
    console.log('Error!', err);
});
uploader.on('abort', function(fileInfo) {
    console.log('Aborted: ', fileInfo);
});


btn2.addEventListener('click', function(e){
    e.preventDefault(e);
    var fileEl = document.getElementById('file');
    var uploadIds = uploader.upload(fileEl.files);

    socket.emit('file', {
		imageTitle: fileInfo.name
	});
});


socket.on('file', function(data){
	output.innerHTML += '<img src="' + imageTitle + '" />';
});