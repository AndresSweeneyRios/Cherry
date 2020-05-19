import path from 'path'
import { execFile } from 'child_process'

export default ( args?: string[] ): Promise<string> => new Promise(
  ( resolve, reject ) => {
    execFile(
      path.join(
        __dirname, 
        process.platform === 'win32' ? '../bin/youtube-dl.exe' : '../bin/youtube-dl'
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
