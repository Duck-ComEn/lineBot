const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer NWaWb04cPlLOtcFvrEiOHWp44c2pdySaZB0BDHS+FBI4Ki2lw7jHGwXaG5Nuz0j1zbp0kmbor622svvOF24YW4d8u4ddERKM9vEDeisl4mBTnzp3t94XrI1SJhRgGqTkS1+t4dwlrJHzbBjJQYI40gdB04t89/1O/w1cDnyilFU=`
};

exports.LineBotPush = functions.https.onRequest((req, res) => {
  
  const userId = req.body.events[0].source.userId;
  res.send("Hi this is a case study");
  if (req.body.events[0].message.type !== 'text') {
   reply(req.body);
  } else {
  return request({
    method: `GET`,
    uri: `https://api.openweathermap.org/data/2.5/weather?units=metric&type=accurate&zip=10330,th&appid=6ff957aacaa6caf8d5d1974c887b8609`,
    json: true
  }).then((response) => {
    const message = `City: ${response.name}\nWeather: ${response.weather[0].description}\nTemperature: ${response.main.temp}`;
    return push(res, message);
  }).catch((error) => {
    return res.status(500).send(error);
  });
  }
});

const push = (res, msg) => {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/push`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      to: `${userId}`,
      messages: [
      {
        type: `text`,
        text: msg
      }
      ]
    })
  }).then(() => {
    return res.status(200).send(`Done`);
  }).catch((error) => {
    return Promise.reject(error);
  });
}

// {
//   "events": [
//     {
//       "type": "message",
//       "replyToken": "b669db6edb5e48dbb5961ab8...",
//       "source": {
//         "userId": "U3c28a70ed7c5e7ce2c9a7597...",
//         "type": "user"
//       },
//       "timestamp": 1531072356142,
//       "message": {
//         "type": "text",
//         "id": "82347...",
//         "text": "ทดสอบ"
//       }
//     }
//   ]
// }

// exports.LineBot = functions.https.onRequest((req, res) => {
//   if (req.body.events[0].message.type !== 'text') {
//     return;
//   }
//   reply(req.body);
// });

const reply = (bodyResponse) => {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: bodyResponse.events[0].replyToken,
      messages: [
      {
        type: `text`,
        text: "WTF"
      }
      ]
    })
  });
};