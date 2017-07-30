#!/usr/bin/env node
import * as program from 'commander';
import { start } from './start';
import { serve } from './serve';
import { guard } from './utils/guard';
import { generate, nameOperator } from './generate';



program
    .version(require('../package.json').version);

program
    .option('-v, --version')
    .action((args) => {
        if (program.version) {
            console.info(require('../package.json').version)
        }
    })

program
    .command('start [dir]')
    .description('start a new Boat app')
    .action(start);

program
    .command('generate [type] [name]')
    .alias('g')
    .description('generate new Boat components')
    .action((type, name) => {
        guard().then(config => {
            generate(type, name);
        });
    });


program
    .command('serve')
    .description('serve your Boat app on a live webserver')
    .action(() => {
        guard().then(config => {
            serve();
        });
    });

program.parse(process.argv);