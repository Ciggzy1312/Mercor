const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const gpt = require('./gpt');

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.post('/', gpt);

app.listen(5000, () => {
    console.log('Server is running on port 5000.');
});