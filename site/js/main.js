var socket = io('http://localhost');

socket.emit(
	'my other event',
	{
		my: 'data'
	}
);
function (data) {
	socket.emit(
		'my other event',
		{
			my: 'data'
		}
	);
}

// socket.on(
// 	'news',

// );