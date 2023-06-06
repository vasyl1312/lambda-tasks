## `Chapter 2`

<br/>
<h3><span style="color:yellow">8. <b>Instagram Giveaway </b></span></h3>

You have **20 files**, each containing 100,000 phrases ([**download**](https://www.dropbox.com/s/cmfya22t3dr0ms5/2kk_words_400x400.zip?dl=0)) . Total - 2 million phrases. They were generated from two batches of 400 random words, so they are repeatedly repeated in all or some files. You need:

> 1️⃣ Determine how many **unique usernames** there are in all specified files (occurs at least once in any of the files).
>
> 2️⃣ Determine how many **usernames** occur simultaneously **in all 20 files**.
>
> 3️⃣ Find out how many **usernames** occur at the same time, **in at least 10 files**.

> **IMPORTANT: We measure the results of the execution of your program - how long does the program calculate (look for how to do this). If it takes you more than a few seconds to complete, then you are doing something wrong. Results with 5-12 or more minutes of execution are not accepted, alas, but this is a web.**

<aside>
💡 For practice, we suggest you first try your hand at a more "compact version" of the problem. In

([**this archive**](https://www.dropbox.com/s/4llp3potsenghzg/200k_words_100x100.zip?dl=0))
there are still 20 files, but they already have 10 thousand (instead of 100 thousand as) phrases that were formed from two batches of random words 100 in each. Total 200,000 phrases.

</aside>
</br>

**MANDATORY** indicate what answers you have when submitting this task. Need a cricket.

The answer is output in the console, after the launch of three separate functions. For example:

- `uniqueValues()` - _// ⇒ Unique phrases: 1234_
- `existInAllFiles()` - _// ⇒ Phrases found in all 20 files: 2222_
- `existInAtLeastTen()` - _// ⇒ Phrases found in at least ten files: 3333_

In total, we complete the task in **three** stages:

1️⃣ We take the first archive with 200,000 values and follow all three points above.

2️⃣ Repeat with an archive of 2 million values.

3️⃣ We think and offer a way to speed up the algorithm (we fight for the minimum execution time).

---

---

<br/>
<h3><span style="color:yellow">9. <b>Vacation grouping</b></span></h3>

On the input you have JSON, in which you have developers. Each one has a unique id, name, and different holiday periods and other information. You literally have to "comb" this JSON into a different, more usable and versatile form.

  <img src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F96528f01-c8d5-49d7-a4be-262c97980c52%2FUntitled.png?id=33e03917-efba-489b-b1f2-f73b30d3112d&table=block&spaceId=2055905c-b0a9-4a70-840e-652fb3ddf0d4&width=990&userId=1eff93d4-281b-4cb7-9815-f73cb9b2abb3&cache=v2"/>

In the original JSON, when a user has **multiple periods** of holiday, this information is rendered \*\*as a separate object for the user name repeating.

**But we don't want it that way - we're drowning in optimization and convenience. Therefore:**

Write an algorithm that will **from the original JSON** make a neater and prettier one, in which:

1. There will be no "superfluous" fields like Status, usedDays, \_id of request.
2. Holiday periods will be output as an array in a nice and clear form.
3. The user himself will appear once in JSON regardless of number of holidays taken.

Here's an option that would be ideal for you to get:
<img src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F6d963f7b-8373-42e1-bb2d-c653efe05eb7%2Fkasd.jpg?id=f8acb19e-ed74-4db5-9317-85a4a02d0d7b&table=block&spaceId=2055905c-b0a9-4a70-840e-652fb3ddf0d4&width=2000&userId=1eff93d4-281b-4cb7-9815-f73cb9b2abb3&cache=v2"/>

---

---

<br/>
<h3><span style="color:yellow">10. <b>JSON Sorting</b></span></h3>

So, you have a list of **20 endpoints**.

Each of them returns a response in a different format and with different key/value pairs. But they all have one thing in common - absolutely all GET-requests are returned by JSON which has the key ¹isDone™ with the boolean value. Queries are divided into four types in which the key/value you are seeking is at different levels of nesting.

Your task:

- Write an app that will poll all the above-mentioned endpoints. Consider a scenario in which a request will be sent several times (up to three is enough) if the previous request fails. If there is no response, remove the result from the issue, but print the error in the console.

- In all the endpoints you get, you need to find the key ːisDone™ and find out if it has the value: ê True™ or ¿False ː.

The result of the successful launch of your application will be the response format:
<img src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F8463c7b9-b52c-4d0a-870e-561148b7a0d9%2FUntitled.png?id=bbe4ecb7-7412-4afb-be55-a28ff322c4b9&table=block&spaceId=2055905c-b0a9-4a70-840e-652fb3ddf0d4&width=730&userId=1eff93d4-281b-4cb7-9815-f73cb9b2abb3&cache=v2"/>

---

---

<br/>
<h3><span style="color:yellow">11. <b>Geopositioning by IP</b></span></h3>

So, you have at your disposal a CSV table [**table\***](https://www.dropbox.com/s/wo0dexr0p3q4fgb/IP2LOCATION-LITE-DB1.CSV?dl=0))., in which you will find a long list of rows with IP and 2-IP bands respectively.

Yours task is to write a web application on Express, highlighting the end point by which a server-hosted algorithm will be able to determine where the user came from and return the IP address value and the country from which the request was made.

- **The application should be able:**
  - _Identify the user’s IP phone by transition_
  - _Determine user location by IP phone using CSV base_
  - _return to the user the range of addresses (in the «human» clear form) and the country on table_

> 🙏 **Note,** NPM force, we acknowledge this, but you need to define the location WITHOUT additional modules, using the CSV file attached above.

Your project can be divided into several modules (why? - I wait for you in the box if you are stuck at the stage of understanding the task). Take your time, no rush. Your algorithm can work extremely slowly in the first stages, think about how it can be accelerated (little hello from the problem [**Insta Giveaway\***](https://github.com/vasyl1312/lambda-tasks/tree/main/main-chapter/8.instagramGiveaway)).

### 👆 **How to check yourself?**

We have prepared for you a list of IP addresses that are allocated to specific countries. If you have done everything correctly, your script should successfully return the response (or to start the output in the console), pointing to the correct country when sending the ID to the Body request:

> Chile - 45.232.208.143
> Armenia - 185.182.120.34
> Mexico - 45.177.176.23
> Turkey - 5.44.80.51
> Norway - 91.149.48.22
> Spain - 83.229.33.3
> Cyprus - 203.24.108.65
> UK - 23.43.23.15
> Ireland - 89.28.176.5
> Romania - 77.83.248.211

To check, you can also install Ngrok and play with Proxy by knocking on an open Ngrok address.

---

---

<br/>
<h3><span style="color:yellow">12. <b>Correctarium</b></span></h3>

In the task it is necessary to write **algorithm of calculation of cost**, time of execution and date of delivery (deadline). Below are the original business requirements that the client has announced.

### **Part #1**

Original business requirements:
<img src="
https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Faa3fe82c-5ec4-4ead-97b9-a7e2335070af%2Fphoto_2021-06-02_20.18.31.jpeg?id=99a95e3d-99a7-411a-bb93-c1a801d03a08&table=block&spaceId=2055905c-b0a9-4a70-840e-652fb3ddf0d4&width=2000&userId=1eff93d4-281b-4cb7-9815-f73cb9b2abb3&cache=v2">

### **Part #2.1**

After writing the algorithm (it seems not to be very difficult) you need to thoroughly check everything. For example, the order was placed at 7 pm on Sunday and the deadline was 11 pm on Sunday night, customers were not satisfied and until we covered all the tests could not be repaired.

Long story short - in this part of the job we cover the algorithm with tests using [JestJs](https://jestjs.io).

**DO NOT READ BEFORE COVERED BY TESTS,**
Break business logic, make it count wrong and see if your test breaks down.

### **Part #2.2**

Write a server application on ExpressJs, REST API to which you can send source data in json format

{

    "language": "en",
    "mimetype": "none|doc|docx|rtf|other" //other for multiplayer, price 1.2
    "count": 10_000

}

and the API in turn will respond

{

    "price": 100.0
    "time": 1
    "deadline": 1623822732 //UNIX
    "deadline_date": "10/10/2021 12:00:00"

}

It is important that business logic tests lie side by side in a project and you can run npm run test to check everything and then with npm start to run the application.

---

---

<br/>
<h3><span style="color:yellow">13. <b>Authorization</b></span></h3>

POST /sign_up
body json:
email: «email»
password: «password»

---

POST /login?email=<email>&password=<password>

---

GET /me[0-9]
headers:
Authorization: Bearer <access_token>

---

POST /refresh
headers:
Authorization: Bearer <refresh_token>

<b>
Write a REST API based on ExpressJs for registration/login based on JWT tokens.
</b>
sign_up registers the user
login and issues an access token with TTL (time to live) from 30 to 60 seconds (randomly)
refresh resets the new access token
me[0-9] gives mock user data and a separate query number field
If the token has exploded (its TTL time has expired) answer 401 Unauthorised

GET /me1

{

    "request_num": 1,
    "data": {
    	"username": "login из токена пользователя"
    }

}

To store user data, use MongoDB, a simple driver without Mongoose

---

---

<br/>
<h3><span style="color:yellow">15. <b>JSON-storage</b>(TS)</span></h3>
So, you have to write a server application that will STORE and GIVE JSON on request. In fact, we are making a similar service jsonbase.com. In this case, the user will be able to specify the desired router within the domain and send his JSON, which will return on the entered router. Magic, isn’t it?😃
<img src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7a2a51b9-adf8-47d4-abed-7a3fab43c37d%2FUntitled.png?id=6978e957-15fe-4d63-98a6-2e7ba710e9ec&table=block&spaceId=2055905c-b0a9-4a70-840e-652fb3ddf0d4&width=1940&userId=1eff93d4-281b-4cb7-9815-f73cb9b2abb3&cache=v2">
To put it simply:

- User adds to baseURL of your service his own router
- Prescribes your desired Body
- Sends a POST Request
- Immediately goes over the specified OWN PATH and receives a response as JSON.

<img src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fb92b248e-2952-4034-a287-006e4c7da9de%2FUntitled.png?id=c17fabe0-23d6-4841-8d20-f8b67238d61e&table=block&spaceId=2055905c-b0a9-4a70-840e-652fb3ddf0d4&width=1810&userId=1eff93d4-281b-4cb7-9815-f73cb9b2abb3&cache=v2">

👆 Points on the task:

**Where to store?** For your taste and color (but there is soil for thinking).

**How to check?** Postman and many-many tests;

**Errors...** Think for the user, where can he frankly screw up...\* Keep this in mind in your app by considering all potential scenarios.

---

---

<br/>
<h3><span style="color:yellow">16. <b>Crypto Rest API</b>(TS)</span></h3>
We have five exchanges listed below. Each exchange has its own API. Every five minutes, we request all APIs to

**get the current price of cryptocurrencies and keep them in the database for each market.**

Create an endpoint that returns cryptocurrency data. Query parameters should be able to:

- specify a specific crypt;
- a specific market (external API) if the market in the query parameters is not passed - return the AVERAGE market price calculated from all five markets;
- for what period to return the crypt data (for the last 15 minutes, 1 hour, 4 hours, 24 hours);

# Technology

- Node.js;
- Express.js;
- DataBase (MySQL) (other ORM);
- CRON;
- Cryptocurrency APIs.
- Heroku;
- NgRok.

# Cryptocurrency API list

- [CoinMarketCap](https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest);
- [CoinBase](https://developers.coinbase.com/api/v2?javascript#introduction);
- [CoinStats](https://documenter.getpostman.com/view/5734027/RzZ6Hzr3);
- [Kucoin](https://docs.kucoin.com/#general);
- [CoinPaprika](https://api.coinpaprika.com/);

---

---

<br/>
<h3><span style="color:yellow">17. <b>Crypto TelegramBot
</b>(TS)</span></h3>

[Link](http://t.me/CryptoTSTelegramBot)

Create a telegram bot that helps to modify the cryptocurrency. The bot works with the endpoint(s), which was created in [previous part]. Note that this is a <b>separate</b> project that only uses <b>Crypto REST API</b>

The following functions should be performed:

- `/start` - returns a welcome message;
- `/help` - returns brief information about the bot and its list of commands;
- `/listRecent` - Get a small (20-50 items) list of "high-rise" crypts. One site should look something like this: `/BTC $250€`, i.e. 250 is the last average price for a crypt, /BTC is an active team when clicking on which the user will get more information about this cryptocurrency; In more detail indicate the history of the average price for the latter.
  24 hours. (withdraw: 30 minutes, 1 hour, 3 hours, 6 hours, 12 hours, 24 hours).
- `/{currency_symbol}` get detailed information about the cryptocurrency. The information message also arrives online button - "Add/Remove to/from following" depending on whether there is a crypt in the following sheet;
- `/addToFavourite {currency_symbol})` - Adds the crypt to the "favourites" section;
- `/listFavourite` - returns a list of selected crypts in the /listRecent format;
- `/deleteFavourite {currency_symbol}` - removes the crypt from the chosen one.

---

---

<br/>
<h3><span style="color:yellow">18. <b>ShortLinker</b>(TS)</span></h3>

Your job is to create a server application that:

- Will accept from the user in the Body POST-query with reference to the resource;
- as a respondent will return a shortened version of this link;
- If you continue using the link created, the user should be able to access the original resource, which he wanted to reduce.

<aside>
💡 
<b>What to consider in a drag?</b>

- the user can make a mistake and enter as an abbreviated link some nonsense - warn him about it in response;
- the look of your short link should look really concise - return the long url to the request for a long - absurd idea.
- in this task you have complete freedom to implement - you choose the tools yourself, the main thing is that everything works;
- services to reduce a TinyUrl, etc., as well as similar thematic apics DO NOT USE
</aside>

---

---

<br/>
<h3><span style="color:yellow">19. <b>Array custom</b>(TS)</span></h3>

Implement a similar custom method. Let’s call it multiply and consider the ability to transmit the parameter factor , which will be an optional multiplier for each element of our array.

If there is no multiplier, multiply each element of the array by 10. As a result, you should have something like:

    const arrayOfNumbers = [1, 2, 3, 4, 5];

    console.log(arrayOfNumbers.multiply(2)) // [2, 4, 6, 8, 10]
    console.log(arrayOfNumbers.multiply()) // [10, 20, 30, 40, 50]

<aside>
💡 That is, nothing is worse than. map, . filter, . reduce, etc.

Now I want to draw your attention to what you need to consider in the task:

- you use TS and STRICTLY type your method, i.e. the value returned after application of the method should not be any;
- your method should have annotations and tell what is happening in it and what parameter is responsible for what;
- do not suffer over classes - you create a method for working with arrays without first declaring the instance of any custom class. This is important.
- do not produce files, let the whole project be implemented in one file, and everyone will be happy.
- do not use standard array methods;
</aside>
<B>Write custom array methods listed in the list below. </B>

About what and who should do the information there [here](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/).

associateBy

average

chunked

distinctBy

filter

filterIndexed

filterNot

find

findLast

flatten

fold

maxBy

minBy

count (with selector - we have an array of objects, inside object key, for example, population). And we want to count the total population for all objects. (analogue countBy).

groupBy - both

////////////////////////////////////////////////////////////////

.all - returns true if all elements match the given predicate

.any - returns true if sequence has at least one element.

.associateBy - Returns a Map containing key-value pairs provided by transform function applied to elements of the given sequence.
