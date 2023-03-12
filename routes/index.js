import express from 'express';;
const router = express.Router();

import {
    getLang,
    getPrimaryColor, getTitle, getSlides
} from '../methods/index.js';


router.post('/api', async (req, res) => {
    try {
        let theme = '';
        let nbSlides = 5;

        const resObj = {
            title: '',
            color: '',
            slides: []
        }

        if (req.body.prompt) {
            theme = req.body.prompt;

            if (req.body.nbSlides > 0 && req.body.nbSlides < 10) {
                nbSlides = req.body.nbSlides
            }
        }

        if (theme) {
            const lang = getLang(theme);
            resObj.color = await getPrimaryColor(theme, false);
            resObj.title = await getTitle(theme, lang, false);
            resObj.slides = await getSlides(resObj.title, lang, nbSlides, false);
        }

        res.json(resObj);
    } catch (error) {
        throw error;
    }
})

export default router;