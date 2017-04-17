"use strict";
exports.__esModule = true;
var shell = require("shelljs");
var chalk = require("chalk");
var pathExists = require("path-exists");
var inquirer = require("inquirer");
function start(dir) {
    if (dir) {
        pathExists(dir, function (err, exists) {
            if (!exists) {
                install(dir);
            }
            else {
                console.log(chalk.blue.red('Something already exists at that path.'));
                process.exit(1);
            }
        });
    }
    else {
        inquirer.prompt([{
                type: 'input',
                name: 'dir',
                message: 'In which directory should we put your Boat project?',
                validate: function (input) {
                    if (input) {
                        return true;
                    }
                },
                filter: function (input) {
                    var item = input.replace(' ', '');
                    return item;
                }
            }]).then(function (answers) {
            install(answers.dir);
        });
    }
}
exports.start = start;
function install(dir) {
    console.log(chalk.blue.bold('Cloning into ' + dir));
    shell.exec('git clone https://github.com/getcanal/boat-starter.git ' + dir);
    console.log(chalk.blue.bold('Running npm install'));
    shell.exec('npm install');
}
//# sourceMappingURL=index-start.js.map