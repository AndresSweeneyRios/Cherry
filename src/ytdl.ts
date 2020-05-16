import path from 'path'
import { execFile } from 'child_process'

export default ( args?: string[] ): Promise<string> => new Promise(
  ( resolve, reject ) => {
    execFile(
      path.join(__dirname, '../bin/youtube-dl.exe'),
      args,
      (error, stdout, stderr) => {
        error || stderr 
          ? reject(error || stderr)
          : resolve(stdout)
      }
    )
  }
)
