function createSocket(http)
{
	var io = require('socket.io')(http);
	var count=1;

	io.on('connection', function(socket){ 
		console.log('user connected: ', socket.id);  
		var name = "게스트" + count++;                 
		socket.name = name;
		io.to(socket.id).emit('create name', name);   
		io.emit('new_connect', name);
	
		socket.on('disconnect', function(){ 
			console.log('user disconnected: '+ socket.id + ' ' + socket.name);
			io.emit('new_disconnect', socket.name);
		});

		socket.on('send message', function(name, text){ 
			var msg = name + ' : ' + text;
			if(name != socket.name)
				io.emit('change name', socket.name, name);
			socket.name = name;
			console.log(msg);
			io.emit('receive message', msg);
		});
	
	});
}

module.exports = createSocket