import * as shell from 'shelljs';
import * as program from 'commander';
import * as chalk from 'chalk';
import * as pathExists from 'path-exists';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';


export function generate(type?: string, name?: string) {
    if (type && name) {
        gen(type, name);
    } else {
        inquirer.prompt([{
            type: 'list',
            choices: [
                'feature',
                'interface',
                'class',
                'middleware'
            ],
            name: 'type',
            message: 'What would you like to generate?'
        }, {
            type: 'input',
            name: 'name',
            message: 'What would you like to name it?',
            validate: function (input: string) {
                if (input) {
                    return true;
                }
            },
            filter: function (input: string) {
                let item = input.replace(' ', '-');
                return item;
            }
        }]).then(answers => {
            gen(answers.type, answers.name);
        })
    }
}

function replaceAll(orig: string, search: string, replacement: string) {
    var target = orig;
    let resp = target.split(search).join(replacement);
    return resp;
};

function gen(type: string, name: string) {
    if (type == 'feature') {

        let names = nameOperator(name, 'feature');

        let controllerPath = path.join(__dirname, '../generators/feature/controller.ts.tmpl');
        let controller = fs.readFileSync(controllerPath, { encoding: 'utf-8' });
        controller = replaceAll(controller, '$CAMEL_CASE', names.$CAMEL_CASE);
        controller = replaceAll(controller, '$HYPHEN_CASE', names.$HYPHEN_CASE);

        let featurePath = path.join(__dirname, '../generators/feature/feature.ts.tmpl');
        let feature = fs.readFileSync(featurePath, { encoding: 'utf-8' });
        feature = replaceAll(feature, '$CAMEL_CASE', names.$CAMEL_CASE);
        feature = replaceAll(feature, '$HYPHEN_CASE', names.$HYPHEN_CASE);

        let pt = path.join(process.cwd(), 'src/features/', names.$HYPHEN_CASE);
        let mod = path.join(process.cwd(), 'src/app.module.ts');
        if (!fs.existsSync(pt)) {
            fs.mkdirSync(pt);
            fs.writeFile(pt + '/' + names.$HYPHEN_CASE + '.controller.ts', controller);
            fs.writeFile(pt + '/' + names.$HYPHEN_CASE + '.feature.ts', feature);
            fs.readFile(mod, 'utf-8', (err, file) => {
                if (!err) {
                    console.log(mod);
                    file = file.replace('// FEATURES', `// FEATURES\nimport { ` + names.$CAMEL_CASE + `Feature } from './features/` + names.$HYPHEN_CASE + `/` + names.$HYPHEN_CASE + `.feature';`);
                    file = file.replace('features: [', 'features: [\n        ' + names.$CAMEL_CASE + 'Feature,')
                    console.log(file);
                    fs.writeFile(mod, file, { encoding: 'utf-8' });
                }
            })
        } else {
            console.error(chalk.red.bold('A feature with that name already exists.'));
            process.exit(1);
        }
    } else if (type == 'interface') {

        let names = nameOperator(name, 'interface');

        let interfacePath = path.join(__dirname, '../generators/interface/interface.ts.tmpl');
        let intf = fs.readFileSync(interfacePath, { encoding: 'utf-8' });
        intf = replaceAll(intf, '$CAMEL_CASE', names.$CAMEL_CASE);

        let pt = path.join(process.cwd(), 'src/models/')
        if (!fs.existsSync(pt)) {
            fs.mkdirSync(pt);
        }
        if (!fs.existsSync(pt + '/' + names.$HYPHEN_CASE + '.interface.ts')) {
            fs.writeFile(pt + '/' + names.$HYPHEN_CASE + '.interface.ts', intf);
        } else {
            console.error(chalk.red.bold('An interface with that name already exists.'));
            process.exit(1);
        }

    } else if (type == 'class') {

        let names = nameOperator(name, 'class');

        let classPath = path.join(__dirname, '../generators/class/class.ts.tmpl');
        let klass = fs.readFileSync(classPath, { encoding: 'utf-8' });
        klass = replaceAll(klass, '$CAMEL_CASE', names.$CAMEL_CASE);

        let pt = path.join(process.cwd(), 'src/models/')
        if (!fs.existsSync(pt)) {
            fs.mkdirSync(pt);
        }
        if (!fs.existsSync(pt + '/' + names.$HYPHEN_CASE + '.class.ts')) {
            fs.writeFile(pt + '/' + names.$HYPHEN_CASE + '.class.ts', klass);
        } else {
            console.error(chalk.red.bold('A class with that name already exists.'));
            process.exit(1);
        }

    } else if (type == 'middleware') {
        let names = nameOperator(name, 'middleware');
        names.$CAMEL_CASE = lowercaseFirstLetter(names.$CAMEL_CASE);
        let middlewarePath = path.join(__dirname, '../generators/middleware/middleware.ts.tmpl');
        let middleware = fs.readFileSync(middlewarePath, { encoding: 'utf-8' });
        middleware = replaceAll(middleware, '$CAMEL_CASE', names.$CAMEL_CASE);

        let pt = path.join(process.cwd(), 'src/middlewares/')

        if (!fs.existsSync(pt)) {
            fs.mkdirSync(pt);
        }
        if (!fs.existsSync(pt + '/' + names.$HYPHEN_CASE + '.middleware.ts')) {
            fs.writeFile(pt + '/' + names.$HYPHEN_CASE + '.middleware.ts', middleware);
        } else {
            console.error(chalk.red.bold('A middleware with that name already exists.'));
            process.exit(1);
        }

        let mod = path.join(process.cwd(), 'src/app.module.ts');
        
        fs.readFile(mod, 'utf-8', (err, file) => {
            if (!err) {
                console.log(mod);
                file = file.replace('// MIDDLEWARES', `// MIDDLEWARES\nimport { ` + names.$CAMEL_CASE + ` } from './middlewares/` + names.$HYPHEN_CASE + `/` + names.$HYPHEN_CASE + `.middleware';`);
                file = file.replace('middlewares: [', 'middlewares: [\n        ' + names.$CAMEL_CASE + 'Feature,')
                console.log(file);
                fs.writeFile(mod, file, { encoding: 'utf-8' });
            }
        })

        // } else if (type == 'module') {

    } else {
        console.error(chalk.red.bold('Invalid type'));
    }
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowercaseFirstLetter(string: string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

export function nameOperator(name: string, type: string): cases {
    if (name.indexOf('-') > -1) {
        name = name.toLowerCase();
        name = name.replace('-' + type.toLowerCase(), '');
        shell.exec('echo ' + name);
        let nameArray: string[] = name.split(/\s*\-\s*/g);
        for (let i = 0; i < nameArray.length; i++) {
            nameArray[i] = capitalizeFirstLetter(nameArray[i]);
        }
        return {
            $CAMEL_CASE: nameArray.join(''),
            $HYPHEN_CASE: name
        }
    } else {
        // name = name.replace('-' + type, '').replace(type, '');
        let s = name.replace(/([A-Z])/g, ' $1').trim().split(' ');
        let t = name.replace(/([A-Z])/g, ' $1').trim().split(' ');
        for (let i = 0; i < s.length; i++) {
            s[i] = s[i].toLowerCase();
            if (s[i] == type.toLowerCase()) {
                s.splice(s.indexOf(type.toLowerCase()), 1);
            } else {
                s[i] = capitalizeFirstLetter(s[i]);
            }
        }
        for (let i = 0; i < t.length; i++) {
            t[i] = t[i].toLowerCase();
            if (t[i] == type.toLowerCase()) {
                t.splice(t.indexOf(type.toLowerCase()), 1);
            }
        }
        return {
            $CAMEL_CASE: s.join(''),
            $HYPHEN_CASE: t.join('-')
        }

    }
}

interface cases {
    $CAMEL_CASE: string;
    $HYPHEN_CASE: string;
}