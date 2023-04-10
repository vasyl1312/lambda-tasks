<div id="header" align="center">
  <img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" width="300" />
</div>

# <b>Lambda</b> tasks (internship)

<h1>
<font color="blue">
<b>
Chapter 1
</b>
</font>
</h1>

<br/>
<h3><font color="yellow">0. <b>Dots</b> </font></h3>Write a script that would take a string consisting of several letters as input, and return an array of strings with all possible combinations of placing strings between them.

<br/>
<h3><font color="yellow">1. <b>CLI: Interactive sort </b></font></h3>An application that, once launched, will:

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
<h3><font color="yellow">2. <b>Primitive DB</b></font></h3>

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
<h3><font color="yellow">3. <b>Telegram Console Sender</b></font></h3>

So, what your application should be able to do:

- A **message** will be sent to the Telegram bot (which you will create beforehand and connect to your application) from the console using the following command:

`node app message 'Your message'`

     The result of executing this command is the appearance of your message in your Telegram bot. After its execution, the CLI itself terminates the process so that the next command can be entered.

- **They will send a photo**, which you drag into the console (or use the handles to enter the correct root for the photo on your PC) using the command:

`node app photo /path/to/photo/picture.png`

     The result of executing this command is a photo sent to the Telegram bot from your PC. After its execution, the CLI itself terminates the process so that the next command can be entered.

- Think about the fact that it will be important for the user to learn how to use your CLI, so take care to describe the commands and display the corresponding recommendations via —help.

<br/>
<h3><font color="yellow">4. <b>Telegram Echo</b></font></h3>

**Task:** Create an echo Telegram bot that will display messages from the user in the console, and also send a picture if the user enters `photo` in the message.

**What is needed for this task:**

- `node-telegram-bot-api`
- `axios'
- service for generating random pictures: [https://picsum.photos/200/300](https://picsum.photos/200/300) (this is your endpoint, to which a random picture will be sent for every request) .
