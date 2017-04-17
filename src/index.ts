#!/usr/bin/env node
import * as program from 'commander';
import { start } from './start';
import { serve } from './serve';

program
    .version(require('../package.json').version);

program
    .command('start [dir]')
    .description('start a new Boat app')
    .action(start);

program
    .command('serve')
    .description('serve your Boat app on a live webserver')
    .action(serve);

program.parse(process.argv);