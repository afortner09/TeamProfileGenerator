(async function () {
    const Manager = require("./lib/Manager");
    const Engineer = require("./lib/Engineer");
    const Intern = require("./lib/Intern");
    const inquirer = require("inquirer");
    const path = require("path");
    const fs = require("fs");
  
    const OUTPUT_DIR = path.resolve(__dirname, "output");
    const outputPath = path.join(OUTPUT_DIR, "team.html");
  
    const render = require("./lib/htmlRenderer");
  
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }
  
  // Write code to use inquirer to gather information about the development team members,
    const arrayOfEmployees = [];
  
    const managerRole = [
      {
        message: 'What is the employee\'s office number?',
        name:'Office Number',
      }
    ]
  
    const roleQuestion = [
      {
        type: 'list',
        message: 'Choose one of the Following.',
        name: 'role',
        choices: ['Intern', 'Engineer'],
      }
    ]
  
    const baseQuestions = [
      {
        message: 'What is the name of the employee?',
        name: 'name',
      },
      {
        message: 'What is the employees ID #?',
        name: 'id',
      },
      {
        message: 'What is the employees email address?',
        name: 'email',
      },
    ]
    let questions = [...baseQuestions];
  
    async function theManager() {
      console.log("Please Enter Manager Info");
      const basicQuestions = await inquirer.prompt(baseQuestions)
      const response = await inquirer.prompt (managerRole)
      const m = new Manager(basicQuestions.name, basicQuestions.id, basicQuestions.email, response.officeNumber)
      arrayOfEmployees.push(m);
    }
  
    async function userRole() {
      console.log('Please Enter Team Member info');
      const response = await inquirer.prompt(roleQuestion)
      questions = [...baseQuestions];
  
      if (response.role === 'Engineer') {
        questions.push(
            {
              message: 'What is the employees github username',
              name: 'github'
            })
      } else if (response.role === 'Intern') {
        questions.push(
            {
              message: 'Please provide the interns school name',
              name: 'school',
            })
      }
      return response.role
    }
  
    const hereWeGoAgainQuestions = [
      {
        type: 'list',
        message: 'Would you like to add another employee? Y/N',
        name: 'again',
        choices: ['Yes', 'No'],
      },
    ]
  
    async function hereWeGoAgain() {
      const response = await inquirer.prompt(hereWeGoAgainQuestions);
  
      if (response.again === 'Yes') {
        let role = await userRole();
        await employee(role);
        await hereWeGoAgain();
      } else if (response.again === 'No') {
        fs.writeFileSync(outputPath, render(arrayOfEmployees));
      }
    }
  
  // and to create objects for each team member (using the correct classes as blueprints!)
    async function employee(role) {
      const response = await inquirer.prompt(questions);
      if (role === 'Engineer') {
        const e = new Engineer(response.name, response.id, response.email, response.github)
        arrayOfEmployees.push(e);
      } else if (role === 'Intern') {
        const i = new Intern(response.name, response.id, response.email, response.school)
        arrayOfEmployees.push(i);
      }
    }
  
    await theManager();
    let role = await userRole();
    await employee(role);
    await hereWeGoAgain();
  
  
  
  // After the user has input all employees desired, call the `render` function (required
  // above) and pass in an array containing all employee objects; the `render` function will
  // generate and return a block of HTML including templated divs for each employee!
  
  // After you have your html, you're now ready to create an HTML file using the HTML
  // returned from the `render` function. Now write it to a file named `team.html` in the
  // `output` folder. You can use the variable `outputPath` above target this location.
  // Hint: you may need to check if the `output` folder exists and create it if it
  // does not.
  
  // HINT: each employee type (manager, engineer, or intern) has slightly different
  // information; write your code to ask different questions via inquirer depending on
  // employee type.
  
  // HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
  // and Intern classes should all extend from a class named Employee; see the directions
  // for further information. Be sure to test out each class and verify it generates an
  // object with the correct structure and methods. This structure will be crucial in order
  // for the provided `render` function to work! ```
  }());