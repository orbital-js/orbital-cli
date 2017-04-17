import * as shell from 'shelljs';
import * as program from 'commander';
import * as chalk from 'chalk';
import * as typescript from 'typescript';

export function serve() {
    shell.exec('tsc');
    shell.exec('node .');
}