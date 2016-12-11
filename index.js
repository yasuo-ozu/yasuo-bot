// const http = require('http');
// var port = process.env.PORT || 5000;
// http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(port);
// console.log('Server running at http://localhost:' + port + "/");
//



var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var CryptoJS = require("crypto-js");
// var config = require('./config/beta/configurations.json');

var http = express();
var port = process.env.PORT || 5000;
// var port = config.port;
var config = {
  accessToken: 'OqndqEonw+rNnlCwR3wc8/TImaZ3QzTYvyKqH6mkq8OIi+ex2sAuZQ9VEzXuwieESUOaw5d3Af1HySAV6FpVrPNMj/8fM8ojDIIwnK1vZzoRMYIMRc3o0kLFSo1TdFlKxW/yCQpP22y+l+0cZJDYPAdB04t89/1O/w1cDnyilFU=',
  // (Optional) for webhook signature validation
  channelSecret: 'deaece338ebcadc7df81aa2b77cff286'
};

http.use(bodyParser.json());

function verifyRequest(req, res, next) {
	// Refer to https://developers.line.me/businessconnect/development-bot-server#signature_validation
	var channelSignature = req.get('X-Line-ChannelSignature');
	var sha256 = CryptoJS.HmacSHA256(JSON.stringify(req.body), config.channelSecret);
	var base64encoded = CryptoJS.enc.Base64.stringify(sha256);
	console.log(base64encoded + "\n\n\n" + channelSignature + "\n\n");
	if (base64encoded === channelSignature) {
		next();
	} else {
		res.status(472).end();
	}
}

http.post('/events', verifyRequest, function(req, res) {
	var result = req.body.result;
	if (!result || !result.length || !result[0].content) {
		res.status(471).end();
		return;
	}
	res.status(200).end();

	// One request may have serveral contents in an array.
	var content = result[0].content;
	// mid
	var from = content.from;
	// Content type would be possibly text/image/video/audio/gps/sticker/contact.
	var type = content.type;
	// assume it's text type here.
	var text = content.text;

	// Refer to https://developers.line.me/businessconnect/api-reference#sending_message
	sendMsg(config.echoBotMid, {
		contentType: 1,
		toType: 1,
		text: 'respond'
	}, function(err) {
		if (err) {
			// sending message failed
			return;
		}
		// message sent
	});
});

function sendMsg(who, content, callback) {
	var data = {
		to: [who],
		toChannel: config.eventToChannelId,
		eventType: config.eventType,
		content: content
	};

	request({
		method: 'POST',
		// https://api.line.me
		url: config.channelUrl + '/v1/events',
		headers: {
			'Content-Type': 'application/json',
			'X-LINE-ChannelToken': config.channelToken
		},
		json: data
	}, function(err, res, body) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});
}

http.listen(port);

