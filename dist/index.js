#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var program = require("commander");
var index_start_1 = require("./index-start");
program
    .version(require('../package.json').version);
program
    .command('start [dir]')
    .description('start a new Boat app')
    .action(index_start_1.start);
program.parse(process.argv);
//# sourceMappingURL=index.js.map