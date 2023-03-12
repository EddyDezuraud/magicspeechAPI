const express = require('express')
const app = express()
const port = process.env.PORT || 5566

app.use(express.bodyParser());

app.get('/api', async (req, res) => {
    try {
        const url = req.body;
        console.log(req.body);
        res.send('working');
    } catch (error) {
        throw error;
    }
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

module.exports = app;