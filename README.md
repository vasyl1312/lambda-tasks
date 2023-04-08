<div id="header" align="center">
  <img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" width="300" />
</div>

# <b>Lambda</b> tasks (internship)

`Chapter 1`

0. <h3><b>Dots</b> </h3>Write a script that would take a string consisting of several letters as input, and return an array of strings with all possible combinations of placing strings between them.

1. <h3> <b>CLI: Interactive sort </b></h3>An application that, once launched, will:

- wait for the user to enter a few words and numbers THROUGH THE SPACE;
- ask a question what the user would like to see at the output - what operation to do with words and numbers, namely:
  - Sort words alphabetically
  - Display numbers from smallest to largest
  - Display numbers from highest to lowest
  - Display words in ascending order by the number of letters in a word
  - Show only unique words
  - Show only unique values from the entire set of words and numbers entered by the user.
  - To exit the program, the user just needs to type `exit` otherwise the program will repeat again and again, requesting new data and suggesting sorting.

2. <h3> <b>Primitive DB</b></h3>

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
