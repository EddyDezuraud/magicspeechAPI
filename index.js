import express from 'express';
import bodyParser from 'body-parser';

import {
    getLang,
    getPrimaryColor, getTitle, getSlides
} from './methods/index.js';

const app = express()
const port = process.env.PORT || 5566

app.use(bodyParser.json({ type: 'application/*+json' }))

app.get('/api', async (req, res) => {
    try {
        const url = req.body;
        const query = req.query;
        let theme = '';

        const resObj = {
            title: '',
            color: '',
            slides: []
        }

        // console.log(process.env.OPENAI_API_KEY);

        if (req.body.prompt) {
            theme = req.body.prompt;
        } else if (query.prompt) {
            theme = query.prompt;
        }

        if (theme) {
            const lang = getLang(theme);
            resObj.color = await getPrimaryColor(theme, lang, true);
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
