'use strict'
const line = require('node-line-bot-api')
const express = require('express')
const bodyParser = require('body-parser')
const lineClient = line.client
const lineValidator = line.validator
const app = express()
app.use(bodyParser.json({
  verify (req, res, buf) {
    req.rawBody = buf
  }
}))

// init with auth
line.init({
  accessToken: 'OqndqEonw+rNnlCwR3wc8/TImaZ3QzTYvyKqH6mkq8OIi+ex2sAuZQ9VEzXuwieESUOaw5d3Af1HySAV6FpVrPNMj/8fM8ojDIIwnK1vZzoRMYIMRc3o0kLFSo1TdFlKxW/yCQpP22y+l+0cZJDYPAdB04t89/1O/w1cDnyilFU=',
  // (Optional) for webhook signature validation
  channelSecret: 'deaece338ebcadc7df81aa2b77cff286'
})

/**
 * response example (https://devdocs.line.me/ja/#webhook):
 * {
 *   "events": [
 *     {
 *       "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
 *       "type": "message",
 *       "timestamp": 1462629479859,
 *       "source": {
 *         "type": "user",
 *         "userId": "u206d25c2ea6bd87c17655609a1c37cb8"
 *       },
 *       "message": {
 *         "id": "325708",
 *         "type": "text",
 *         "text": "Hello, world"
 *       }
 *     }
 *   ]
 * }
 */

app.post('/webhook/', line.validator.validateSignature(), (req, res, next) => {
	console.log("webhook1");
  // get content from request body
  const promises = req.body.events.map(event => {
	console.log("webhook2");
    // reply message
    return line.client
      .replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: event.message.text
          }
        ]
      })
  })
	console.log("webhook3");
  Promise
    .all(promises)
    .then(() => res.json({success: true}))
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!')
})
