const express = require('express')
const $PORT = 8080;
const cors = require ('cors');
const monk = require('monk')
const Filter = require('bad-words')
const rateLimit = require('express-rate-limit')

const app = express();
const db = monk(process.env.MONGO_URI || 'localhost:27017/meower')
const mews = db.get('mews')
const filter = new Filter()

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({message: "hello"})
});


app.get('/mews', (req, res) => {
  mews
    .find()
    .then(mews => {
      res.json(mews);//wrapされる
    })
})


function isValidMew(mew) {
  return mew.name !== "" && mew.content !== ""
}

app.post('/mews', (req, res) => {
  if (isValidMew(req.body)) {
    const mew = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date()
    };
    
    mews
    .insert(mew)
    .then(createdMew => {
      res.json(createdMew);
    });
  }else{
    res.status(422);
    res.json({
      message: "Hey! name and content are required"
    })
  }
});

app.listen($PORT);