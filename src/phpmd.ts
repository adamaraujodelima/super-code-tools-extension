import { CommandResult, buildCommand, execPromise } from './command'
import * as vscode from 'vscode'
import { Issue } from './extension'

export const phpmdCheck = async (document: vscode.TextDocument): Promise<Issue[]> => {
    if (vscode.workspace.getConfiguration('superCodeTools').get('phpmd') === false) {
        return []
    }

    try {
        const command = buildCommand('phpmd-check', document, [
            'json',
            'cleancode,codesize,controversial,design,naming,unusedcode'
        ])

        console.log('phpmd-check', command)

        const result = await execPromise(command)
        if (result.stderr) {
            console.error(`exec error: ${result.stderr}`)
            vscode.window.showErrorMessage('Error on phpmd command', result.stderr)
            return []
        }

        const issues: Issue[] = []
        const output = JSON.parse(result.stdout)

        console.log('phpmd-check', output)

        return issues
    } catch (err) {
        console.error(err)
        const error = err as CommandResult
        vscode.window.showErrorMessage('Error on PHPMD command', error.stderr)
        return []
    }
}
