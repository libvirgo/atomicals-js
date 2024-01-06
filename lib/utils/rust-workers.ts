// 封装Go调用逻辑
import {spawn} from 'child_process';
import * as stream from 'stream';

// 封装rust binary调用逻辑
// get stdout and stderr data and log it
export async function spawnWorker(bin, data) {
    return new Promise((resolve, reject) => {
        const child = spawn(bin, [JSON.stringify(data)]);
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (data:Buffer) => {
            let line = data.toString('utf8')
            console.log(data.toString('utf8'))
            // if contains a87c1c7c-02a2-4d7d-ae59-81b176127c81
            if (line.indexOf('a87c1c7c-02a2-4d7d-ae59-81b176127c81') > -1) {
                stdout += line;
            }

        });
        child.stderr.on('data', (data:Buffer) => {
            console.log(data.toString('utf8'))
        });
        child.on('close', (code) => {
            if (code !== 0) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
}