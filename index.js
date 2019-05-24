const twilio = require('twilio');

const accountSid = 'ACbc98dc6e6611d07a49fecf14dba35958';
const authToken = '219dc6db55938d524334b2deb2a9e225';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Hi Papa',
     from: '+12044003933',
     to: '+19782964802'
   })
  .then(message => console.log(message))
  .catch(err => {
  	console.log(err.message);
  })