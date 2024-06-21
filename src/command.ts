import { exec } from 'child_process'
import * as vscode from 'vscode'

const imageName = 'adamaraujodelima/super-code-tools:1.1'

export const buildCommand = (command: string, document: vscode.TextDocument, options: string[]) => {
    const folder = vscode.workspace.workspaceFolders?.[0].uri.fsPath
    const volume = `${folder}:${folder}`
    const extraArguments = options ? options.join(' ') : ''
    return `docker run --rm -v ${volume} ${imageName} sh -c "${command} ${extraArguments} ${document.uri.fsPath}"`
}

export const execPromise = (command: string): Promise<{ stdout: string, stderr: string }> => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ stderr: error.message })
            } else {
                resolve({ stdout: stdout, stderr: '' })
            }
        })
    })
}
