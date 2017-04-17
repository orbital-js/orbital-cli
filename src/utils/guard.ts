import * as path from 'path';
import * as fs from 'fs';

export function guard() {
    return new Promise((resolve, reject) => {
        let pt = path.join(process.cwd(), 'boat-cli.json')
        fs.readFile(pt, (err, config) => {
            if (err) {
                reject('You must be in a Boat CLI project to run this command.');
            } else {
                resolve(config);
            }
        });
    })
}