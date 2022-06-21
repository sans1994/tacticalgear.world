/*
Copyright 2018 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// server.js
// where your node app starts
// load dependencies
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
