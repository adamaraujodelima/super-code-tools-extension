import { exec } from 'child_process'
import * as vscode from 'vscode'
import { readConfig } from './configuration'

export type CommandResult = { stdout: string, stderr: string }

const containerName = 'super-code-tools'

export const startContainer = async () => {
    const imageName = readConfig('image') as string
    const workspaceDir = readConfig('workspace.folder') as string
    const parentDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath
    const appDir = workspaceDir ? `${parentDir}/${workspaceDir}` : parentDir
    const volume = `${appDir}:${appDir}`
    const command = `docker run -d --rm -it --name ${containerName} -v ${volume} -w ${appDir}  ${imageName}`
    return execPromise(command)
}

export const stopContainer = async () => {
    const command = `docker stop ${containerName}`
    return execPromise(command)
}

export const buildCommand = (tool: string, document: vscode.TextDocument, options: string[]): string => {
    const extraArguments = options ? options.join(' ') : ''
    const command = `docker exec ${containerName} sh -c "${tool} ${extraArguments} ${document.uri.fsPath}"`
    console.log(command)
    return command
}

export const execPromise = (command: string): Promise<CommandResult> => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error && !stdout) {
                reject({ error, stdout, stderr })
            }

            resolve({ stdout, stderr: ''})
        })
    })
}
