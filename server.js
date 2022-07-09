require('dotenv').config();
const express = require('express');
const app = express();
const rendertron = require('rendertron-middleware');
const PORT = process.env.PORT || 8880;
const DIST_FOLDER = process.cwd() + '/dist';
const BOTS = rendertron.botUserAgents.concat('googlebot');
const BOT_UA_PATTERN = new RegExp(BOTS.join('|'), 'i');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.set('view engine', 'html');

app.use(rendertron.makeMiddleware({
	proxyUrl: 'http://localhost:8888/render/',
	userAgentPattern: BOT_UA_PATTERN
}));

// Static Assets
app.get('*.*', express.static('dist'));

// Point all routes to index...
app.get('*', (req, res) => {
	res.set('Vary', 'User-Agent');
	res.sendFile(DIST_FOLDER + '/index.html');
});

// Start Express Server
app.listen(PORT, () => {
	console.log(`Node Express server listening on ${PORT}`);
});
