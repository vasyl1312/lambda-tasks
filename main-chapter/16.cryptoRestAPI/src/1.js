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
var dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/.env' });
require('dotenv').config({ path: __dirname + '/.env' });
var port = process.env.PORT || 3000;
var app = express();
app.use(express.json());
var pool = (0, promise_1.createPool)({
    host: "".concat(process.env.DB_HOST),
    user: "".concat(process.env.DB_USER),
    password: "".concat(process.env.DB_PASSWORD),
    database: "".concat(process.env.DB_NAME),
});
// Функція для отримання актуальної ціни криптовалюти з API бірж
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
    var symbol, market, period, whereClause, values, markets, averagePrice, _i, markets_2, market_1, price, timeBoundary, connection, selectQuery, cryptoData, error_4;
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
                markets = ['CoinBase', 'CoinStats', 'Kucoin', 'CoinPaprika'];
                averagePrice = 0;
                _i = 0, markets_2 = markets;
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
                averagePrice /= markets.length;
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
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
