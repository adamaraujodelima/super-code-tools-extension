import * as vscode from 'vscode'
import { CommandResult, buildCommand, execPromise } from './command'
import { Issue } from './extension'
import { readConfig } from './configuration'

type Result = {
    totals: {
        errors: number
        warnings: number
        fixable: number
    },
    files: {
        [key: string]: {
            errors: number
            warnings: number
            messages: {
                message: string
                line: number
                column: number
                fixable: boolean
            }[]
        }
    }
}

export const phpcsCheck = async (document: vscode.TextDocument): Promise<Issue[]> => {
    if (readConfig('phpcs') === false) {
        return []
    }

    try {
        const command = buildCommand('phpcs-check', document, [
            '-q',
            '--report=json'
        ])

        const result: CommandResult = await execPromise(command)
        if (result.stderr) {
            console.error(`exec error: ${result.stderr}`)
            vscode.window.showErrorMessage('Error on phpcs command', result.stderr)
            return []
        }

        const output: Result = JSON.parse(result.stdout)

        if (output.totals.errors === 0) {
            return []
        }

        const issues: Issue[] = []
        for (const file in output.files) {
            const messages = output.files[file].messages
            for (const message of messages) {
                issues.push({
                    lineFrom: message.line,
                    lineTo: message.line,
                    from: message.column,
                    to: message.column,
                    message: message.message,
                    tool: 'PHPCS'
                })
            }
        }

        return issues
    } catch (err) {
        console.error(err)
        const error = err as CommandResult
        vscode.window.showErrorMessage('Error on PHPCS command', error.stderr)
        return []
    }
}
