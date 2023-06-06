"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cron = require("node-cron");
var axios_1 = require("axios");
var promise_1 = require("mysql2/promise");
var TelegramBot = require("node-telegram-bot-api");
var dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/.env' });
require('dotenv').config({ path: __dirname + '/.env' });
var app = express();
app.use(express.json());
var port = process.env.PORT || 3000;
var pool = (0, promise_1.createPool)({
    host: "".concat(process.env.DB_HOST),
    user: "".concat(process.env.DB_USER),
    password: "".concat(process.env.DB_PASSWORD),
    database: "".concat(process.env.DB_NAME),
});
var botToken = "".concat(process.env.TG_TOKEN);
var bot = new TelegramBot(botToken, { polling: true });
function getLatestCryptoPrice(symbol, market) {
    return __awaiter(this, void 0, void 0, function () {
        var apiUrl, price, response, foundCoinStats, foundKucoin, foundCoinPaprika, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiUrl = '';
                    price = 0;
                    switch (market) {
                        case 'CoinBase':
                            apiUrl = "https://api.coinbase.com/v2/prices/".concat(symbol, "-USD/buy");
                            break;
                        case 'CoinStats':
                            apiUrl = "https://api.coinstats.app/public/v1/coins";
                            break;
                        case 'Kucoin':
                            apiUrl = "https://api.kucoin.com/api/v1/market/allTickers";
                            break;
                        case 'CoinPaprika':
                            apiUrl = "https://api.coinpaprika.com/v1/tickers";
                            break;
                        default:
                            throw new Error('Invalid market');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(apiUrl)];
                case 2:
                    response = _a.sent();
                    switch (market) {
                        case 'CoinBase':
                            price = parseFloat(response.data.data.amount);
                            break;
                        case 'CoinStats':
                            foundCoinStats = {
                                data: {
                                    coins: response.data.coins.filter(function (obj) { return obj.symbol === symbol; }),
                                },
                            };
                            price = parseFloat(foundCoinStats.data.coins[0].price);
                            break;
                        case 'Kucoin':
                            foundKucoin = {
                                data: {
                                    time: response.data.data.time,
                                    ticker: response.data.data.ticker.filter(function (obj) { return obj.symbol === "".concat(symbol, "-USDT"); }),
                                },
                            };
                            price = parseFloat(foundKucoin.data.ticker[0].averagePrice);
                            break;
                        case 'CoinPaprika':
                            foundCoinPaprika = response.data.reduce(function (res, obj) {
                                if (obj.symbol === symbol) {
                                    res.push(obj);
                                }
                                return res;
                            }, []);
                            price = foundCoinPaprika[0].quotes.USD.price;
                            break;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to fetch price from ".concat(market, ":"), error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, price];
            }
        });
    });
}
// Функція для збереження ціни криптовалюти в базу даних
function saveCryptoPrice(connection, symbol, market, price, timestamp) {
    return __awaiter(this, void 0, void 0, function () {
        var insertQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    insertQuery = 'INSERT INTO crypto_prices (symbol, market, price, timestamp) VALUES (?, ?, ?, ?)';
                    return [4 /*yield*/, connection.execute(insertQuery, [symbol, market, price, timestamp])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Підключення до бази даних MySQL та створення таблиці, якщо вона не існує
;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, pool.getConnection()
                    // Створення таблиці crypto_prices, якщо вона не існує
                ];
            case 1:
                connection = _a.sent();
                // Створення таблиці crypto_prices, якщо вона не існує
                return [4 /*yield*/, connection.query("\n      CREATE TABLE IF NOT EXISTS crypto_prices (\n        id INT AUTO_INCREMENT PRIMARY KEY,\n        symbol VARCHAR(10) NOT NULL,\n        market VARCHAR(20) NOT NULL,\n        price DECIMAL(12, 2) NOT NULL,\n        timestamp DATETIME NOT NULL\n      )\n    ")];
            case 2:
                // Створення таблиці crypto_prices, якщо вона не існує
                _a.sent();
                connection.release();
                console.log('Connected to MySQL database');
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Failed to connect to MySQL database:', error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })();
// CRON задача для отримання і зберігання актуальних цін криптовалют кожні 5 хвилин
cron.schedule('*/5 * * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    var markets, symbols, connection, _i, symbols_1, symbol, _a, markets_1, market, price, timestamp, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                markets = ['CoinBase', 'CoinStats', 'Kucoin', 'CoinPaprika'];
                symbols = ['BTC', 'ETH', 'LTC'];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, , 11]);
                return [4 /*yield*/, pool.getConnection()];
            case 2:
                connection = _b.sent();
                _i = 0, symbols_1 = symbols;
                _b.label = 3;
            case 3:
                if (!(_i < symbols_1.length)) return [3 /*break*/, 9];
                symbol = symbols_1[_i];
                _a = 0, markets_1 = markets;
                _b.label = 4;
            case 4:
                if (!(_a < markets_1.length)) return [3 /*break*/, 8];
                market = markets_1[_a];
                return [4 /*yield*/, getLatestCryptoPrice(symbol, market)];
            case 5:
                price = _b.sent();
                timestamp = new Date();
                return [4 /*yield*/, saveCryptoPrice(connection, symbol, market, price, timestamp)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 4];
            case 8:
                _i++;
                return [3 /*break*/, 3];
            case 9:
                connection.release();
                return [3 /*break*/, 11];
            case 10:
                error_3 = _b.sent();
                console.error('Failed to fetch or save crypto prices:', error_3);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
// Ендпоінт для отримання даних по криптовалютах
app.get('/cryptos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, market, period, whereClause, values, markets_3, averagePrice, _i, markets_2, market_1, price, timeBoundary, connection, selectQuery, cryptoData, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                symbol = req.query.symbol;
                market = req.query.market;
                period = req.query.period;
                if (!symbol) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing symbol parameter' })];
                }
                whereClause = 'WHERE symbol = ?';
                values = [symbol];
                if (!market) return [3 /*break*/, 1];
                whereClause += ' AND market = ?';
                values.push(market);
                return [3 /*break*/, 6];
            case 1:
                markets_3 = ['CoinBase', 'CoinStats', 'Kucoin', 'CoinPaprika'];
                averagePrice = 0;
                _i = 0, markets_2 = markets_3;
                _a.label = 2;
            case 2:
                if (!(_i < markets_2.length)) return [3 /*break*/, 5];
                market_1 = markets_2[_i];
                return [4 /*yield*/, getLatestCryptoPrice(symbol, market_1)];
            case 3:
                price = _a.sent();
                averagePrice += price;
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                averagePrice /= markets_3.length;
                return [2 /*return*/, res.json({ averagePrice: averagePrice })];
            case 6:
                timeBoundary = new Date();
                switch (period) {
                    case '15m':
                        timeBoundary.setMinutes(timeBoundary.getMinutes() - 15);
                        break;
                    case '1h':
                        timeBoundary.setHours(timeBoundary.getHours() - 1);
                        break;
                    case '4h':
                        timeBoundary.setHours(timeBoundary.getHours() - 4);
                        break;
                    case '24h':
                        timeBoundary.setHours(timeBoundary.getHours() - 24);
                        break;
                    default:
                        timeBoundary.setHours(timeBoundary.getHours() - 24);
                }
                _a.label = 7;
            case 7:
                _a.trys.push([7, 10, , 11]);
                return [4 /*yield*/, pool.getConnection()
                    //відносно дати шукаємо дані
                ];
            case 8:
                connection = _a.sent();
                selectQuery = "\n      SELECT *\n      FROM crypto_prices\n      ".concat(whereClause, " AND timestamp >= ?\n      ORDER BY timestamp DESC\n    ");
                return [4 /*yield*/, connection.execute(selectQuery, __spreadArray(__spreadArray([], values, true), [timeBoundary], false))];
            case 9:
                cryptoData = (_a.sent())[0];
                connection.release();
                return [2 /*return*/, res.json(cryptoData)];
            case 10:
                error_4 = _a.sent();
                console.error('Failed to fetch crypto data from database:', error_4);
                return [2 /*return*/, res.status(500).json({ error: 'Failed to fetch crypto data' })];
            case 11: return [2 /*return*/];
        }
    });
}); });
////////////////TASK 17//////////////////////// Telegram bot commands
// Обробка команди /start
bot.onText(/\/start/, function (msg) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привіт, ласкаво просимо! (Що вміє бот? /help )');
});
// Обробка команди /help
bot.onText(/\/help/, function (msg) {
    var chatId = msg.chat.id;
    var helpMessage = 'Ось список доступних команд:\n' +
        '/start - привітання\n' +
        '/help - довідка\n' +
        '/listRecent - список "хайпової" крипти\n' +
        '/listFavourite - список вибраних криптовалют';
    bot.sendMessage(chatId, helpMessage);
});
var markets = ['CoinBase', 'CoinStats', 'Kucoin', 'CoinPaprika'];
var symbols = ['BTC', 'ETH', 'LTC'];
// // Обробка команди /listRecent
bot.onText(/\/listRecent/, function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, marketButtons, symbolButtons, keyboard;
    return __generator(this, function (_a) {
        chatId = msg.chat.id;
        marketButtons = markets.map(function (market) {
            return { text: market, callback_data: "market_".concat(market) };
        });
        symbolButtons = symbols.map(function (symbol) {
            return { text: symbol, callback_data: "symbol_".concat(symbol) };
        });
        keyboard = [marketButtons, symbolButtons];
        bot.sendMessage(chatId, 'Виберіть ринок та символ:', {
            reply_markup: {
                inline_keyboard: keyboard,
            },
        });
        return [2 /*return*/];
    });
}); });
bot.on('callback_query', function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, data, market_2, symbolButtons, keyboard, _a, symbol, market, response, responseData, items, itemList, error_5;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                chatId = (_b = query.message) === null || _b === void 0 ? void 0 : _b.chat.id;
                data = query.data;
                if (!data || !chatId) {
                    console.error('Помилка: data or chatId є undefined.');
                    return [2 /*return*/];
                }
                if (!data.startsWith('market_')) return [3 /*break*/, 1];
                market_2 = data.replace('market_', '');
                symbolButtons = symbols.map(function (symbol) {
                    return { text: symbol, callback_data: "symbol_".concat(symbol, "_").concat(market_2) };
                });
                keyboard = [symbolButtons];
                bot.sendMessage(chatId, "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0441\u0438\u043C\u0432\u043E\u043B \u0434\u043B\u044F \u0440\u0438\u043D\u043A\u0443 ".concat(market_2, ":"), {
                    reply_markup: {
                        inline_keyboard: keyboard,
                    },
                });
                return [3 /*break*/, 5];
            case 1:
                if (!data.startsWith('symbol_')) return [3 /*break*/, 5];
                _a = data.replace('symbol_', '').split('_'), symbol = _a[0], market = _a[1];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.get("http://localhost:3000/cryptos?symbol=".concat(symbol, "&market=").concat(market))];
            case 3:
                response = _c.sent();
                responseData = response.data;
                if (responseData) {
                    items = responseData.map(function (crypto) {
                        var price = parseFloat(crypto.price).toFixed(2);
                        return "/".concat(crypto.symbol, " $").concat(price);
                    });
                    itemList = items.join('\n');
                    bot.sendMessage(chatId, itemList);
                }
                else {
                    bot.sendMessage(chatId, 'Отримано невідповідні дані від сервера.');
                }
                return [3 /*break*/, 5];
            case 4:
                error_5 = _c.sent();
                console.error('Помилка отримання даних:', error_5);
                bot.sendMessage(chatId, 'Виникла помилка при отриманні даних. Спробуйте пізніше.');
                return [3 /*break*/, 5];
            case 5:
                bot.answerCallbackQuery(query.id);
                return [2 /*return*/];
        }
    });
}); });
// Створення таблиці "favorites"
function createFavoritesTable() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.getConnection()];
                case 1:
                    connection = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 6]);
                    return [4 /*yield*/, connection.query('CREATE TABLE IF NOT EXISTS favorites (currency_symbol VARCHAR(10) NOT NULL PRIMARY KEY)')];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_6 = _a.sent();
                    console.error('Помилка при створенні таблиці favorites:', error_6);
                    return [3 /*break*/, 6];
                case 5:
                    connection.release();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
createFavoritesTable();
bot.onText(/\/(\w+)/, function (msg, match) { return __awaiter(void 0, void 0, void 0, function () {
    var command, symbols, currencySymbol, reply, _loop_1, _i, markets_4, market, isFavorite, buttonText, inlineKeyboard, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = match && match[1] ? match[1].toUpperCase() : '';
                symbols = ['BTC', 'ETH', 'LTC'];
                if (!symbols.includes(command)) return [3 /*break*/, 8];
                currencySymbol = match && match[1] ? match[1].toUpperCase() : '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                reply = "\u0414\u0430\u043D\u0456 \u0441\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u0457 \u0446\u0456\u043D\u0438 \u0434\u043B\u044F \u043A\u0440\u0438\u043F\u0442\u043E\u0432\u0430\u043B\u044E\u0442\u0438: ".concat(currencySymbol, "\n");
                _loop_1 = function (market) {
                    var apiUrl, response, data, last24HoursData, calculateAveragePrice, timeIntervals, output;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                apiUrl = "http://localhost:3000/cryptos?symbol=".concat(currencySymbol, "&market=").concat(market);
                                return [4 /*yield*/, axios_1.default.get(apiUrl)];
                            case 1:
                                response = _b.sent();
                                data = response.data;
                                last24HoursData = data.filter(function (item) {
                                    var timestamp = new Date(item.timestamp).getTime();
                                    var currentTime = new Date().getTime();
                                    var timeDifferenceInHours = (currentTime - timestamp) / (1000 * 60 * 60);
                                    return timeDifferenceInHours <= 24;
                                });
                                calculateAveragePrice = function (hours) {
                                    var currentTime = new Date().getTime();
                                    var startTime = currentTime - hours * 60 * 60 * 1000;
                                    var filteredData = last24HoursData.filter(function (item) {
                                        var timestamp = new Date(item.timestamp).getTime();
                                        return timestamp >= startTime;
                                    });
                                    if (filteredData.length === 0) {
                                        return null;
                                    }
                                    var sum = filteredData.reduce(function (total, item) {
                                        return total + parseFloat(item.price);
                                    }, 0);
                                    return sum / filteredData.length;
                                };
                                timeIntervals = [0.5, 1, 3, 6, 12, 24];
                                output = timeIntervals.map(function (hours) {
                                    var averagePrice = calculateAveragePrice(hours);
                                    var formattedPrice = averagePrice !== null ? averagePrice.toFixed(2) : 'Немає даних';
                                    return "\u0417\u0430 \u043E\u0441\u0442\u0430\u043D\u043D\u0456 ".concat(hours, " \u0433\u043E\u0434: ").concat(formattedPrice, "$");
                                });
                                // Формуємо рядок відповіді для кожного ринку
                                reply += "".concat(market, ":\n");
                                reply += output.join('\n');
                                reply += '\n\n'; // Додаємо перехід на новий рядок між ринками
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, markets_4 = markets;
                _a.label = 2;
            case 2:
                if (!(_i < markets_4.length)) return [3 /*break*/, 5];
                market = markets_4[_i];
                return [5 /*yield**/, _loop_1(market)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, checkIfCurrencyIsFavorite(currencySymbol)];
            case 6:
                isFavorite = _a.sent();
                buttonText = isFavorite ? 'Remove from following' : 'Add to following';
                inlineKeyboard = [
                    [{ text: buttonText, callback_data: "addToFavorite ".concat(currencySymbol) }],
                ];
                // Відправляємо повідомлення з результатами та інлайн кнопкою
                bot.sendMessage(msg.chat.id, reply, {
                    reply_markup: {
                        inline_keyboard: inlineKeyboard,
                    },
                });
                return [3 /*break*/, 8];
            case 7:
                error_7 = _a.sent();
                console.error('Помилка запиту до сервера:', error_7);
                bot.sendMessage(msg.chat.id, 'Виникла помилка. Будь ласка, спробуйте пізніше.');
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// Обробка вибору інлайн кнопки
bot.on('callback_query', function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var data, message, _a, command, currencySymbol, chatId, isFavorite, answerOptions, answerOptions;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!query.data) return [3 /*break*/, 5];
                data = query.data, message = query.message;
                _a = data.split(' '), command = _a[0], currencySymbol = _a[1];
                if (!(command === 'addToFavorite')) return [3 /*break*/, 5];
                chatId = (message === null || message === void 0 ? void 0 : message.chat.id) || 0;
                return [4 /*yield*/, checkIfCurrencyIsFavorite(currencySymbol)];
            case 1:
                isFavorite = _b.sent();
                if (!isFavorite) return [3 /*break*/, 3];
                // Видалення крипти зі списку "улюблене"
                return [4 /*yield*/, removeCurrencyFromFavorites(chatId, currencySymbol)];
            case 2:
                // Видалення крипти зі списку "улюблене"
                _b.sent();
                answerOptions = {
                    callback_query_id: query.id,
                    text: isFavorite ? 'Removed from following' : 'Added to following',
                };
                bot.answerCallbackQuery(answerOptions);
                return [3 /*break*/, 5];
            case 3: 
            // Додавання крипти до списку "улюблене"
            return [4 /*yield*/, addCurrencyToFavorites(chatId, currencySymbol)];
            case 4:
                // Додавання крипти до списку "улюблене"
                _b.sent();
                answerOptions = {
                    callback_query_id: query.id,
                    text: 'Added to following',
                };
                bot.answerCallbackQuery(answerOptions);
                _b.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
// Додавання крипти до списку "улюблене"
function addCurrencyToFavorites(chatId, currencySymbol) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, query, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.getConnection()];
                case 1:
                    connection = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 6]);
                    query = 'INSERT INTO favorites (currency_symbol) VALUES (?)';
                    return [4 /*yield*/, connection.query(query, [currencySymbol])];
                case 3:
                    _a.sent();
                    bot.sendMessage(chatId, "\u041A\u0440\u0438\u043F\u0442\u043E\u0432\u0430\u043B\u044E\u0442\u0430 ".concat(currencySymbol, " \u0434\u043E\u0434\u0430\u043D\u0430 \u0434\u043E \u0441\u043F\u0438\u0441\u043A\u0443 \u0443\u043B\u044E\u0431\u043B\u0435\u043D\u0438\u0445. \n /help"));
                    return [3 /*break*/, 6];
                case 4:
                    error_8 = _a.sent();
                    console.error('Помилка при додаванні крипти до списку favorites:', error_8);
                    throw error_8;
                case 5:
                    connection.release();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Видалення крипти зі списку "улюблене"
function removeCurrencyFromFavorites(chatId, currencySymbol) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, query, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.getConnection()];
                case 1:
                    connection = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 6]);
                    query = 'DELETE FROM favorites WHERE currency_symbol = ?';
                    return [4 /*yield*/, connection.query(query, [currencySymbol])];
                case 3:
                    _a.sent();
                    bot.sendMessage(chatId, "\u041A\u0440\u0438\u043F\u0442\u043E\u0432\u0430\u043B\u044E\u0442\u0430 ".concat(currencySymbol, " \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u0430 \u0437\u0456 \u0441\u043F\u0438\u0441\u043A\u0443 \u0443\u043B\u044E\u0431\u043B\u0435\u043D\u0438\u0445. \n /help"));
                    return [3 /*break*/, 6];
                case 4:
                    error_9 = _a.sent();
                    console.error('Помилка при видаленні крипти зі списку favorites:', error_9);
                    throw error_9;
                case 5:
                    connection.release();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Обробка команди /listFavourite
bot.onText(/\/listFavourite/, function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, favoriteCurrencies, response, _i, favoriteCurrencies_1, currency, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chatId = msg.chat.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getFavoriteCurrencies()];
            case 2:
                favoriteCurrencies = _a.sent();
                if (favoriteCurrencies.length > 0) {
                    response = '';
                    for (_i = 0, favoriteCurrencies_1 = favoriteCurrencies; _i < favoriteCurrencies_1.length; _i++) {
                        currency = favoriteCurrencies_1[_i];
                        response += "/".concat(currency.symbol, " $").concat(currency.price, "\n");
                    }
                    bot.sendMessage(chatId, response);
                }
                else {
                    bot.sendMessage(chatId, 'You have no favorite cryptocurrencies.');
                }
                return [3 /*break*/, 4];
            case 3:
                error_10 = _a.sent();
                console.error('Error retrieving favorite cryptocurrencies:', error_10);
                bot.sendMessage(chatId, 'An error occurred while retrieving favorite cryptocurrencies.');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Перевірка, чи крипта є в списку "улюблене"
function checkIfCurrencyIsFavorite(currencySymbol) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var connection, query, rows, count, error_11;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, pool.getConnection()];
                case 1:
                    connection = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, 5, 6]);
                    query = 'SELECT COUNT(*) AS count FROM favorites WHERE currency_symbol = ?';
                    return [4 /*yield*/, connection.query(query, [currencySymbol])];
                case 3:
                    rows = (_b.sent())[0];
                    count = ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
                    return [2 /*return*/, count > 0];
                case 4:
                    error_11 = _b.sent();
                    console.error('Error checking if currency is favorite:', error_11);
                    throw error_11;
                case 5:
                    connection.release();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Отримання улюблених криптовалют
function getFavoriteCurrencies() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, query, rows, favoriteCurrencies, _i, rows_1, row, currencySymbol, isFavorite, currencyData, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.getConnection()];
                case 1:
                    connection = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 9, 10, 11]);
                    query = 'SELECT * FROM favorites';
                    return [4 /*yield*/, connection.query(query)];
                case 3:
                    rows = (_a.sent())[0];
                    favoriteCurrencies = [];
                    _i = 0, rows_1 = rows;
                    _a.label = 4;
                case 4:
                    if (!(_i < rows_1.length)) return [3 /*break*/, 8];
                    row = rows_1[_i];
                    currencySymbol = row.currency_symbol;
                    return [4 /*yield*/, checkIfCurrencyIsFavorite(currencySymbol)];
                case 5:
                    isFavorite = _a.sent();
                    if (!isFavorite) return [3 /*break*/, 7];
                    return [4 /*yield*/, getCurrencyData(currencySymbol)];
                case 6:
                    currencyData = _a.sent();
                    favoriteCurrencies.push(currencyData);
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 4];
                case 8: return [2 /*return*/, favoriteCurrencies];
                case 9:
                    error_12 = _a.sent();
                    console.error('Error retrieving favorite currencies:', error_12);
                    throw error_12;
                case 10:
                    connection.release();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// Отримання даних про криптовалюту
function getCurrencyData(symbol) {
    return __awaiter(this, void 0, void 0, function () {
        var apiUrl, response, responseData, currency, price, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiUrl = "http://localhost:3000/cryptos?symbol=".concat(symbol, "&market=CoinStats");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(apiUrl)];
                case 2:
                    response = _a.sent();
                    responseData = response.data;
                    if (Array.isArray(responseData) && responseData.length > 0) {
                        currency = responseData[0];
                        price = parseFloat(currency.price).toFixed(2);
                        return [2 /*return*/, {
                                symbol: currency.symbol,
                                price: price,
                            }];
                    }
                    else {
                        throw new Error('Invalid response data');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_13 = _a.sent();
                    console.error("Error getting data for currency ".concat(symbol, ":"), error_13);
                    throw error_13;
                case 4: return [2 /*return*/];
            }
        });
    });
}
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
//http://t.me/CryptoTSTelegramBot
