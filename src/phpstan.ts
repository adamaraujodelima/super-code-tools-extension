import * as vscode from 'vscode'
import { CommandResult, buildCommand, execPromise } from './command'
import { Issue } from './extension'

type Result = {
    errors: string[],
    files: {
        [key: string]: {
            errors: number,
            messages: {
                message: string,
                line: number,
                file: string
            }[]
        }
    }
    totals: {
        errors: number
        file_errors: number
    }
}

export const phpStanCheck = async (document: vscode.TextDocument): Promise<Issue[]> => {
    if (vscode.workspace.getConfiguration('superCodeTools').get('phpstan') === false) {
        return []
    }

    try {
        const command = buildCommand('phpstan-check', document, [
            '--error-format=json'
        ])

        const result = await execPromise(command)
        if (result.stderr) {
            console.error(`exec error: ${result.stderr}`)
            vscode.window.showErrorMessage('Error on phpstan command', result.stderr)
            return []
        }

        const output: Result = JSON.parse(result.stdout)
        if (output.totals.errors === 0 && output.totals.file_errors === 0) {
            return []
        }

        return output.files[document.uri.fsPath].messages.map(message => {
            return {
                lineFrom: message.line,
                lineTo: message.line,
                from: vscode.workspace.getConfiguration('editor').get('tabSize') as number,
                to: 100,
                message: message.message,
                tool: 'phpstan'
            }
        })
    } catch (err) {
        console.error(err)
        const error = err as CommandResult
        vscode.window.showErrorMessage('Error on PHPSTAN command', error.stderr)
        return []
    }
}
