import { CommandResult, buildCommand, execPromise } from './command'
import * as vscode from 'vscode'
import { Issue } from './extension'

type Result = {
    files: {
        file: string,
        violations: {
            beginLine: number,
            endLine: number,
            rule: string,
            ruleset: string,
            priority: number,
            description: string,
            class: string,
            package: string,
        }[]
    }[]
}

export const phpmdCheck = async (document: vscode.TextDocument): Promise<Issue[]> => {
    if (vscode.workspace.getConfiguration('superCodeTools').get('phpmd') === false) {
        return []
    }

    try {
        const command = buildCommand('phpmd-check', document, [
            'json',
        ])

        const result = await execPromise(command)
        if (result.stderr) {
            console.error(`exec error: ${result.stderr}`)
            vscode.window.showErrorMessage('Error on phpmd command', result.stderr)
            return []
        }

        const issues: Issue[] = []
        const output: Result = JSON.parse(result.stdout)

        output.files.forEach(file => {
            file.violations.forEach(violation => {
                issues.push({
                    lineFrom: violation.beginLine,
                    lineTo: violation.endLine,
                    message: violation.description,
                    from: 0,
                    to: 0,
                    tool: 'PHPMD'
                })
            })
        })

        return issues
    } catch (err) {
        console.error(err)
        const error = err as CommandResult
        vscode.window.showErrorMessage('Error on PHPMD command', error.stderr)
        return []
    }
}
