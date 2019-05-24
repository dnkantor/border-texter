const twilio = require('twilio');

const accountSid = '********************************';
const authToken = '********************************';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Hi!',
     from: '+1***********',
     to: '+1***********'
   })
  .then(message => console.log(message))
  .catch(err => {
  	console.log(err.message);
  })
