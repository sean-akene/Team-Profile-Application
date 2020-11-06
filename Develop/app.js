const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const writeFileAsync = util.promisify(fs.writeFile);

const employees = [];
const managerQuestion = [
    {
        type: "input",
        name: "name",
        message: "what is your name?",

    },
    {
        type: "input",
        name: "id",
        message: "what is your email address?",
    },
    {
        type: "input",
        name: "officeNumber",
        message: "what is your office number?",
    }
];

const engineerQuestion = [
    {
        type: "input",
        name: "name",
        message: "what is the engineer's name?",
    },
    {
        type: "input",
        name: "id",
        message: "what is the engineer's id?",
    },

    {
        type: "input",
        name: "email",
        message: "what is the engineer's email address?",
    },

    {
        type: "input",
        name: "username",
        message: "what is the engineer's GitHub username?",
    },
];

const internQuestion = [
    {
        type: "input",
        name: "name",
        message: "what is the intern's name?",
    },

    {
        type: "input",
        name: "id",
        message: "what is the intern's id?",
    },

    {
        type: "input",
        name: "email",
        message: "what is the intern's email address?",
    },

    {
        type: "input",
        name: "school",
        message: "what is the intern's school name?",
    },
];

const jobTitle = {
    type: "list",
    name: "title",
    message: "What is your job title?",
    choices: ["Manager", "Engineer", "Intern"],
  };
  
  const toNextEmployee = {
    type: "confirm",
    name: "nextEmployee",
    message: "Do you want to enter another employee? ",
    default: true,
  };
  
  async function init() {
    let question = "";
    const { title } = await inquirer.prompt(jobTitle);
    switch (title) {
      case "Manager":
        question = managerQuestion;
        break;
      case "Engineer":
        question = engineerQuestion;
        break;
      case "Intern":
        question = internQuestion;
        break;
      default:
    }
    getAnswer(question);
  }
  init();

  async function getAnswer(questions) {
    try {
      questions.push(toNextEmployee);
      const { nextEmployee, ...answers } = await inquirer.prompt(questions);
      const { name, id, email, github, school, officeNumber } = answers;
      if (officeNumber) {
        employees.push(new Manager(name, id, email, officeNumber));
      } else if (github) {
        employees.push(new Engineer(name, id, email, github));
      } else {
        employees.push(new Intern(name, id, email, school));
      }
      if (nextEmployee) {
        init();
      } else {
        const html = render(employees);
        await writeFileAsync(outputPath, html);
      }
    } catch (err) {
      console.log(err);
    }
  }
  