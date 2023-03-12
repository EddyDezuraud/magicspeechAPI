import express from 'express';
import bodyParser from 'body-parser';

import {
    getLang,
    getPrimaryColor, getTitle, getSlides
} from './methods/index.js';

const app = express()
const port = process.env.PORT || 5566

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"),
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
        next()
})

app.use(bodyParser.json({ type: 'application/*+json' }))

app.post('/api', async (req, res) => {
    try {
        let theme = '';

        const resObj = {
            title: '',
            color: '',
            slides: []
        }

        if (req.body.prompt) {
            theme = req.body.prompt;
        }

        if (theme) {
            const lang = getLang(theme);
            resObj.color = await getPrimaryColor(theme, false);
            resObj.title = await getTitle(theme, lang, true);
            resObj.slides = await getSlides(resObj.title, lang, 5, true);
        }

        res.json(resObj);
    } catch (error) {
        throw error;
    }
})

app.get('/api', async (req, res) => {
    try {
        const query = req.query;
        let theme = '';

        const resObj = {
            title: '',
            color: '',
            slides: []
        }

        theme = query.prompt;

        if (theme) {
            const lang = getLang(theme);
            resObj.color = await getPrimaryColor(theme, false);
            resObj.title = await getTitle(theme, lang, true);
            resObj.slides = await getSlides(resObj.title, lang, 5, true);
        }

        res.json(resObj);
    } catch (error) {
        throw error;
    }
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
