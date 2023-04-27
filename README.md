<div id="header" align="center">
  <img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" width="300" />
</div>

# <b>Lambda</b> tasks (<span style="color:green">internship</span>)

## `Chapter 1`

<br/>
<h3><span style="color:yellow">0. <b>Dots</b> </span></h3>Write a script that would take a string consisting of several letters as input, and return an array of strings with all possible combinations of placing strings between them.

<br/>
<h3><span style="color:yellow">1. <b>CLI: Interactive sort </b></span></h3>An application that, once launched, will:

- wait for the user to enter a few words and numbers THROUGH THE SPACE;
- ask a question what the user would like to see at the output - what operation to do with words and numbers, namely:
  - Sort words alphabetically
  - Display numbers from smallest to largest
  - Display numbers from highest to lowest
  - Display words in ascending order by the number of letters in a word
  - Show only unique words
  - Show only unique values from the entire set of words and numbers entered by the user.
  - To exit the program, the user just needs to type `exit` otherwise the program will repeat again and again, requesting new data and suggesting sorting.

<br/>
<h3><span style="color:yellow">2. <b>Primitive DB</b></span></h3>

**App work algorithm:**

- after launch, a message is displayed with a request to specify a name;
- then it is suggested to choose a gender from the list;
- specify age;
- then the cycle is repeated with the addition of the user. In this way, you can add one more user.
- To **stop the procedure of adding users**, it is enough to **press ENTER** instead of entering the name.
- After refusing to add the user further, the application offers to find the user by name in the database. You can choose two answers: Y/N. When N is selected, we exit, when Y is selected, we perform a search and report the results: if the user is found in the database, we display all information about him, if not, we indicate that such a user does not exist.

  **Moments and nuances:**

- your database is a text file to which new users are constantly added without overwriting the previous ones.
- organize data storage in your database in such a way that each user can be easily turned into an object, i.e. you think in such a way that in front of you is the prototype of a non-relational database, and in the txt file there is almost ready-made JSON (the parse and stringify methods should work with a bang).
- pay attention to the search algorithm. Remember that Google returns you when you enter a query, you probably get more than one link as a relevant result.
- take into account the option that the user may like to write in CAPS, but still wants to get valid results

<br/>
<h3><span style="color:yellow">3. <b>Telegram Console Sender</b></span></h3>
<a href="https://t.me/console_senderBot" target="_blank">Link in Telegram</a>

So, what your application should be able to do:

- A **message** will be sent to the Telegram bot (which you will create beforehand and connect to your application) from the console using the following command:

`node app message 'Your message'`

     The result of executing this command is the appearance of your message in your Telegram bot. After its execution, the CLI itself terminates the process so that the next command can be entered.

- **They will send a photo**, which you drag into the console (or use the handles to enter the correct root for the photo on your PC) using the command:

`node app photo /path/to/photo/picture.png`

     The result of executing this command is a photo sent to the Telegram bot from your PC. After its execution, the CLI itself terminates the process so that the next command can be entered.

- Think about the fact that it will be important for the user to learn how to use your CLI, so take care to describe the commands and display the corresponding recommendations via —help.

<br/>
<h3><span style="color:yellow">4. <b>Telegram Echo</b></span></h3>
<a href="https://t.me/WeatherForecast_and_RateBot" target="_blank">Link in Telegram</a>

**Task:** Create an echo Telegram bot that will display messages from the user in the console, and also send a picture if the user enters `photo` in the message.

**What is needed for this task:**

- `node-telegram-bot-api`
- `axios'
- service for generating random pictures: [https://picsum.photos/200/300](https://picsum.photos/200/300) (this is your endpoint, to which a random picture will be sent for every request) .

<br/>
<h3><span style="color:yellow">5. <b>TelegramBot: weather forecast</b></span></h3>
<a href="https://t.me/WeatherForecast_and_RateBot" target="_blank">Link in Telegram</a>

Your task: to write a bot that will give the user a weather forecast for a particular city. Choose a city according to your taste or place of residence, uncritically.

**Telegram bot requirements:**

- it should be able to return a weather forecast for every 3 hours or every 6 hours on user request.
- the menu structure should be represented by the buttons: "Forecast in the Dnipro" ⇒ "With an interval of 3 hours" / "with an interval of 6 hours" (one button, after pressing which a menu with two more buttons opens).
- the bot should work all the time, and not just at the moment when you start the server. To do this, use a service like Render/Vercel/Hiroku(not free).

**What you need for the bot:**

- `OpenWeather API` ([documentation](https://openweathermap.org/api)).
- `node-telegram-bot-api` to customize your bot logic
- `Render/Vercel/Hiroku` service for unloading the finished code and running it "on the server"
- `Axios` for making API requests.

**Note:**

- the answer should be returned in a "satisfactory variant".
- consider using sockets so that your bot does not fall asleep after 30 minutes.
- When writing a bot, keep in mind that in one of the following tasks you will have to supplement its functionality.

<br/>
<h3><span style="color:yellow">6. <b>TelegramBot: exchange currency Bot </b></span></h3>
<a href="https://t.me/WeatherForecast_and_RateBot" target="_blank">Link in Telegram</a>

- To the previously created weather bot, add two buttons that will allow you to find out the USD and EUR rates.
- To do this, use the PrivatBank or Monobank APIs. Keep in mind that Monobank does not allow requests to be executed more often than once every 60 seconds, and dozens of people can use your bot.
- Implement this logic so that the bot does not return an error, but provides the current exchange rate.

<br/>
<h3><span style="color:yellow">7. <b>Google Uploader</b></span></h3>

The application should **upload the picture** to the specified and pre-prepared folder in Google Drive.

🤘🏻 What you need to do a task:

- Axios
- inquirer
- documentation for Google Drive and OAuth2
- API to shorten links: [https://api.tinyurl.com/](https://tinyurl.com/app/dev)

⚠️ **What to consider in a task:**

- use official Google documentation and configure the application (get OAuth keys, etc.) in Google Console.
- use Inquirer to create a console interface
- keep in mind that the Access token has an expiry date and you should consider the update script, otherwise the tab will not work
- all the necessary credits apply to the project

<br/><br/>
################################################

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

<br/>
<h3><span style="color:yellow">10. <b>JSON Sorting</b></span></h3>

So, you have a list of **20 endpoints**.

Each of them returns a response in a different format and with different key/value pairs. But they all have one thing in common - absolutely all GET-requests are returned by JSON which has the key ¹isDone™ with the boolean value. Queries are divided into four types in which the key/value you are seeking is at different levels of nesting.

Your task:

- Write an app that will poll all the above-mentioned endpoints. Consider a scenario in which a request will be sent several times (up to three is enough) if the previous request fails. If there is no response, remove the result from the issue, but print the error in the console.

- In all the endpoints you get, you need to find the key ːisDone™ and find out if it has the value: ê True™ or ¿False ː.

The result of the successful launch of your application will be the response format:
<img src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F8463c7b9-b52c-4d0a-870e-561148b7a0d9%2FUntitled.png?id=bbe4ecb7-7412-4afb-be55-a28ff322c4b9&table=block&spaceId=2055905c-b0a9-4a70-840e-652fb3ddf0d4&width=730&userId=1eff93d4-281b-4cb7-9815-f73cb9b2abb3&cache=v2"/>

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

### **How do we check:**

Of course I will. But first the performance test: you run Ngrok on your side (**[link](https://ngrok.com/)** to familiarize this console utility), we knock on the endpoint code and want to see everything described above as a JSON-response.

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
