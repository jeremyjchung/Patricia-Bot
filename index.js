'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am Patricia!')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'try_try_and_trie_again') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

const token = process.env.FB_PAGE_ACCESS_TOKEN

app.post('/webhook', function (req, res) {
  var data = req.body

  // Make sure this is a page subscription
  if (data.object === 'page') {
    data.entry.forEach(function(entry) {
      var sender = entry.id;

      entry.messaging.forEach(function(event) {
        if (event.message && even.message.text) {
          sendTextMessage(sender, event.message.text);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      })
    })

    res.sendStatus(200);
  }
})

function sendTextMessage(sender, text) {
  	let messageData = { text:text }

  	request({
    		url: 'https://graph.facebook.com/v2.6/me/messages',
    		qs: {access_token:token},
    		method: 'POST',
    		json: {
    			recipient: {id:sender},
    			message: messageData,
    		}
  	}, function(error, response, body) {
    		if (error) {
    			console.log('Error sending messages: ', error)
    		} else if (response.body.error) {
    			console.log('Error: ', response.body.error)
    		}
  	})
}


// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
