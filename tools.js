const tasks = {
    socialcards: require('./tools/social-cards'),
    deadlinks: require('./tools/dead-links'),
    inclusive: require('./tools/inclusive'),
}

var inquirer = require('inquirer');

var questions = [
    {
        type: 'checkbox',
        name: 'task',
        message: 'Tasks to run',
        choices: [
            { value: 'socialcards', name: 'Generate social cards' },
            { value: 'deadlinks', name: 'Check dead links' },
            { value: 'inclusive', name: 'Check insensitive, inconsiderate writing' }
        ],
    }
]
const Database = require('warehouse');
const db = new Database({path: './db.json'});
const ui = new inquirer.ui.BottomBar();

db.load()
    .then(() => {
        return inquirer.prompt(questions)
    })
    .then(answers => {
        ui.updateBottomBar('Processing...');

        const selectedTasks = answers.task

        const taskPromises = selectedTasks.map(task => {
            return tasks[task](ui.log, db)
        })

        return Promise.all(taskPromises)
    })
    .then(result => {
        ui.updateBottomBar('Finished!');
    })
    .catch(err => {
        console.log('Error!', err);
    });