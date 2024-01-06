// 封装Go调用逻辑
import {spawn} from 'child_process';
import {createInterface} from "readline";

export interface WorkerResult {
  sequence: number
  nonce: number
  time: number
  magic: string
}

// 封装rust binary调用逻辑
// get stdout and stderr data and log it
export async function spawnWorker(bin, data): Promise<WorkerResult> {
  return new Promise<WorkerResult>((resolve, reject) => {
    const child = spawn(bin, [JSON.stringify(data)]);
    let stdout = '';
    let stderr = '';
    const rl = createInterface({input: child.stdout})
    rl.on('line', (line) => {
      if (line.includes('a87c1c7c-02a2-4d7d-ae59-81b176127c81')) {
        stdout = line;
      } else {
        console.log(line)
      }
    })
    child.stderr.on('data', (data: Buffer) => {
      console.log(data.toString('utf8'))
    });
    child.on('close', (code) => {
      if (code !== 0) {
        reject(stderr);
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
}