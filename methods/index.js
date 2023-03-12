// OPEN AI CONFIG
import { franc } from 'franc'
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-szkRr0A9FnHYz1KqbM74sxX3",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const openAiCall = async (prompt) => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 500,
    });
    return response.data.choices[0].text;
}

const getLang = async (theme) => {
    const lang = franc(theme);
    if (lang === 'fra') {
        return 'French';
    }
    return 'English';
}


const getPrimaryColor = async (theme, eco) => {

    if (eco) return '#FF6666';

    const prompt = "I will ask to you a theme. Your task is to return a color hex code only as response without any phrase. This color must be AA compliant on a black background. The theme is : " + theme;
    const str = await openAiCall(prompt);
    const hexCode = str.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
    return hexCode[0];
}

const getTitle = async (theme, lang, eco) => {
    if (eco) return 'L\'histoire du Limoges CSP';

    const prompt = "I will give to you a theme. Your task is to return a title to make a presentation about this theme. The theme is : " + theme;
    const str = await openAiCall(prompt + ' in ' + lang);
    const title = str;
    return title;
}

const getSummary = async (theme, lang, nbSlides, eco) => {
    if (eco) return ['Les débuts', 'Les victoires', 'Le présent'];

    const prompt = " will give to you a theme. Your task is to create a presentation about this theme. You will return a list of"
        + nbSlides
        + "elements separates with '+++'. With a title of 7 words maximum for each point . The theme is : "
        + theme + ' in ' + lang;

    const str = await openAiCall(prompt);
    const arr = str.split('+++');
    const result = arr.slice(1, -1).map(item => item.trim());
    return result;
}

const getPointResume = async (theme, lang, point, eco) => {
    if (eco) return 'Texte de test pour des raisons économiques';

    const prompt = "For a presentation in the theme of "
        + theme
        + " can you develop a phrase to explain this subject "
        + point + " in " + lang;

    const str = await openAiCall(prompt);
    return str;
}

const getImage = async (theme) => {
    const response = await axios.get(`https://www.google.com/search?q=${theme}&tbm=isch`);
    const $ = cheerio.load(response.data);
    const images = $('img')
        .map((i, el) => $(el).attr('src'))
        .get();
    const randomIndex = Math.floor(Math.random() * 10);
    const imageUrl = images[randomIndex];

    return imageUrl;
}

const scrapImage = async (query) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.google.com/search?q=${query}&tbm=isch`);

    console.log(query);

    const imageResults = await page.$$eval('.rg_i', (images) =>
        images.map((image) => {
            console.log(image)
            const img = image.querySelector('img');
            const title = img.getAttribute('alt');
            const thumbnail = img.getAttribute('src');
            const link = image.getAttribute('data-src');
            const source = image.querySelector('.rg_i').nextSibling.nextSibling.innerText;
            const original = image.parentNode.parentNode.parentNode.nextSibling.querySelector('.e2BEnf span').innerText;

            return { title, thumbnail, link, source, original };
        })
    );

    await browser.close();

    console.log(imageResults);

    const randomIndex = Math.floor(Math.random() * 10);
    const imageUrl = imageResults[randomIndex];

    return imageUrl;
}

const getSlides = async (theme, lang, nbSlides, eco) => {
    const slides = [];

    const mainPoints = await getSummary(theme, lang, nbSlides, eco);

    for await (const el of mainPoints) {
        if (el && el !== '' && /^\d+\.$/.test(el) === false) {
            const content = await getPointResume(theme, lang, el, eco);
            const picture = await getImage(theme + ' ' + el);
            slides.push({ title: el, content, picture });
        }
    }
    return slides;
}

export {
    getLang,
    getPrimaryColor,
    getTitle,
    getSlides,
}