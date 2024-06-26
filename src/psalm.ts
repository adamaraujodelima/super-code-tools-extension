import { CommandResult, buildCommand, execPromise } from "./command"
import * as vscode from 'vscode'
import { Issue } from "./extension"

type Result = {
    column_from: number
    column_to: number
    from: number
    to: number
    line_from: number
    line_to: number
    message: string
    file_path: string
    link: string
}

export const psalmCheck = async (document: vscode.TextDocument): Promise<Issue[]> => {
    try {
        const command = buildCommand('psalm-check', document, [
            '--output-format=json'
        ])

        const result = await execPromise(command)
        if (result.stderr) {
            console.error(`exec error: ${result.stderr}`)
            vscode.window.showErrorMessage('Error on psalm command', result.stderr)
            return []
        }

        const output: Result[] = JSON.parse(result.stdout)
        if (output.length === 0) {
            return []
        }

        return output.map(message => {
            return {
                lineFrom: message.line_from,
                lineTo: message.line_to,
                from: message.column_from,
                to: message.column_to,
                message: message.message,
                tool: 'psalm'
            }
        })
    } catch (err) {
        console.error(err)
        const error = err as CommandResult
        vscode.window.showErrorMessage('Error on PSALM command', error.stderr)
        return []
    }
}
