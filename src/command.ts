import { exec } from 'child_process'
import * as vscode from 'vscode'

const imageName = 'adamaraujodelima/super-code-tools:1.1'

export const buildCommand = (tool: string, document: vscode.TextDocument, options: string[]): string => {
    const folder = vscode.workspace.workspaceFolders?.[0].uri.fsPath
    const volume = `${folder}:${folder}`
    const extraArguments = options ? options.join(' ') : ''
    const command = `docker run --rm -v ${volume} ${imageName} sh -c "${tool} ${extraArguments} ${document.uri.fsPath}"`
    console.log(command)
    return command
}

export const execPromise = (command: string): Promise<{ stdout: string, stderr: string }> => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error && error.signal) {
                reject({ error, stdout, stderr })
            }

            resolve({ stdout, stderr: ''})
        })
    })
}
