import path from 'path'
import { execFile } from 'child_process'
import os from 'os'

const arch = os.arch()

export default ( args?: string[] ): Promise<string> => new Promise(
  ( resolve, reject ) => {
    execFile(
      path.join(
        __dirname, 
        /x32|x64/.test(arch) ? '../bin/youtube-dl.exe' : '../bin/youtube-dl'
      ),
      args,
      (error, stdout, stderr) => {
        error || stderr 
          ? reject(error || stderr)
          : resolve(stdout)
      }
    )
  }
)
