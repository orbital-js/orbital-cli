import * as shell from 'shelljs';
import * as program from 'commander';
import * as chalk from 'chalk';
import * as pathExists from 'path-exists';
import * as inquirer from 'inquirer';

export function start(dir?: string) {
    if (dir) {
        pathExists(dir, (err, exists: boolean) => {
            if (!exists) {
                install(dir);
            } else {
                console.error(chalk.red.red('Something already exists at that path.'));
                process.exit(1);
            }
        })
    } else {
        inquirer.prompt([{
            type: 'input',
            name: 'dir',
            message: 'In which directory should we put your Boat project?',
            validate: function (input: string) {
                if (input) {
                    return true;
                }
            },
            filter: function (input: string) {
                let item = input.replace(' ', '-');
                return item;
            }
        }]).then((answers) => {
            install(answers.dir);
        })
    }

}

function install(dir: string) {
    console.info(chalk.blue.bold('Cloning into ' + dir));
    shell.exec('git clone https://github.com/getcanal/boat-starter.git ' + dir);
    console.info(chalk.blue.bold('Installing dependencies from npm'));
    shell.exec('npm install');
}