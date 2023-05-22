"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const valid_url_1 = __importDefault(require("valid-url"));
const crypto_1 = __importDefault(require("crypto"));
const port = 3000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const urlDatabase = {};
function generateShortURL(url) {
    const hash = crypto_1.default.createHash('md5').update(url).digest('hex');
    return hash.slice(0, 6);
}
app.post('/shorten', (req, res) => {
    const { link } = req.body;
    if (!valid_url_1.default.isUri(link)) {
        return res.status(400).json('Invalid URL');
    }
    const shortURL = generateShortURL(link);
    urlDatabase[shortURL] = link;
    res.json({ shortURL: `http://localhost:${port}/` + shortURL });
});
app.get('/:shortURL', (req, res) => {
    const { shortURL } = req.params;
    if (shortURL in urlDatabase) {
        res.redirect(urlDatabase[shortURL]);
    }
    else {
        res.status(404).json('Short URL not found');
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
