const express = require('express');
const app = express();
const port = 3001;
var helper = require("./helper.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World '));
app.get('/tree', async (req, res) => {
  try {
    let data = await helper.tree()
    res.send(data)
  } catch (error) {
    let errorMessage = error.message;
    return res.json(errorMessage);
  }
});

app.post('/tree', async (req, res) => {
  var errors = []
  if (req.body.parent === 'undefined') 
    errors.push("No parent id for the animal was given");
  
  if (!req.body.label) 
    errors.push("No label for the animal was given");
  
  if (errors.length) {
    res.status(400).json({
      "error": errors.join(",")
    });
    return errors;
  }

  try {
    let result = await helper.addAnimal(req.body.parent, req.body.label)
    res.status(result.status).send({
      message: result.message
    });
  } catch (error) {
    let errorMessage = error.message;
    return res.json(errorMessage);
  }
});

app.get('/resetTree', async (req, res) => {

  try {
    let result = await helper.resetAnimalTree()
    res.status(result.status).send({
      message: result.message
    });
  } catch (error) {
    let errorMessage = error.message;
    return res.json(errorMessage);
  }
});

app.listen(port, () => console.log(`port :: ${port}`));