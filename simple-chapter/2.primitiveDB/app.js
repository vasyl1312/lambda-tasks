import inquirer from 'inquirer'
import fs from 'fs'

const databasePath = 'users.txt'

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter user name: ',
    validate: (input) => {
      if (!input.trim()) {
        return 'Name must not be empty'
      }
      return true
    },
  },
  {
    type: 'list',
    name: 'gender',
    message: 'Select gender: ',
    choices: ['male', 'female'],
  },
  {
    type: 'input',
    name: 'age',
    message: 'Enter age: ',
    validate: (input) => {
      if (!/^\d+$/.test(input) || input < 0) {
        return 'Age must be a number > 0'
      }
      return true
    },
  },
]

function addUser() {
  inquirer.prompt(questions).then((answers) => {
    const { name, gender, age } = answers
    const user = { name, gender, age }

    const users = getUsers()
    users.push(user)

    saveUsers(users)

    inquirer
      .prompt({
        type: 'confirm',
        name: 'addAnother',
        message: '\nAdd another user?',
      })
      .then((answer) => {
        if (answer.addAnother) {
          addUser()
        } else {
          viewUsers()
          findUser()
        }
      })
  })
}

function getUsers() {
  try {
    const data = fs.readFileSync(databasePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function saveUsers(users) {
  fs.writeFileSync(databasePath, JSON.stringify(users))
}

function viewUsers() {
  const users = getUsers()

  if (users.length > 0) {
    console.log('\n All list of users: ')
    users.forEach((user) => {
      console.log(`Name: ${user.name}, gender: ${user.gender}, age: ${user.age}`)
    })
  } else {
    console.log('\nList of users is empty...')
  }
}

function findUser() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: '\nEnter the name of the user to search: ',
    })
    .then((answer) => {
      const users = getUsers()
      const foundUsers = users.filter(
        (user) => user.name.toLowerCase() === answer.name.toLowerCase()
      )

      if (foundUsers.length > 0) {
        console.log('I found this:\n')
        foundUsers.forEach((user) => {
          console.log(`Name: ${user.name}, gender: ${user.gender}, age: ${user.age}`)
        })
      } else {
        console.log('\nI didn`t find this user...')
        viewUsers()
      }

      inquirer
        .prompt({
          type: 'confirm',
          name: 'searchAgain',
          message: '\nDo you want to search again?',
        })
        .then((answer) => {
          if (answer.searchAgain) {
            findUser()
          } else {
            console.log('\nHave a good day')
          }
        })
    })
}

addUser()
