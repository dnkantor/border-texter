const express = require('express');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const superagent = require('superagent');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({extented: true}))

app.post('/sms', async (req, res) => {
  const twiml = new MessagingResponse();
  console.log(req.body);
  var isBridge = 0;
  var user = req.body.From;
  var body = req.body.Body;

  let bridges = await load();

  for (i in bridges) {
    if (bridges[i].bridgeName == body) {
       twiml.message(`Hi! ${user}, ${bridges[i].bridgeName} has a delay of ${bridges[i].bridgeTravellerDelay}. This data was last updated ${bridges[i].bridgeLastUpdated}`);
       isBridge = 1;
    }
  }
  
  if (isBridge == 0) twiml.message(`You sent ${body}, this bridge does not exist.`);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.listen(1337, () => {
  console.log('Express server listening on port 1337');
});

async function load() {
  let bridges = await superagent.get('http://www.cbsa-asfc.gc.ca/bwt-taf/menu-eng.html')
                              .then(page => page.text)
                              .then(getTimes);
  return bridges;
}

function getTimes(text) {
	const bridges = [];

  const $ = cheerio.load(text);

  const table = $('#bwttaf');

  table.find('tr').each((index, element) => {
    var bridge = {
  		bridgeName : "",
  		bridgeTravellerDelay : "",
  		bridgeLastUpdated : ""
	  };

  	bridge.bridgeName = $(element).find('th b').text();
    bridge.bridgeTravellerDelay = $(element).find('td').eq(1).text();
    bridge.bridgeLastUpdated = $(element).find('td').eq(2).text();
  	bridges.push(bridge);
  });
  // .each((index, element) => {
  //     headers.push(element.firstChild.nodeValue);
  // });

  return bridges;
}
