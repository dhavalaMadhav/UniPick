const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/log-error', (req, res) => {
    console.log('BROWSER ERROR:', req.body);
    res.sendStatus(200);
});
app.listen(3001, () => console.log('Error logger listening on 3001'));
