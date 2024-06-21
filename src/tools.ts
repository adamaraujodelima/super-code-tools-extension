import { buildCommand, execPromise } from "./command"
import * as vscode from 'vscode'

export const phpmdCheck = async (document: vscode.TextDocument) => {
    try {
        const command = buildCommand('phpmd-check', document, [
            'json',
            'cleancode,codesize,controversial,design,naming,unusedcode'
        ])
        const result = await execPromise(command)
        if (result.stderr) {
            console.error(`exec error: ${result.stderr}`)
            vscode.window.showErrorMessage('Error on phpmd command', result.stderr)
            return
        }

        return JSON.parse(result.stdout)
    } catch (err) {
        vscode.window.showErrorMessage('Failed to start Docker container.')
        console.error(err)
    }
}

export const phpStanCheck = async (document: vscode.TextDocument) => {
    try {
        const command = buildCommand('phpstan-check', document, [
            '--error-format=json'
        ])
        console.log(command)
        const result = await execPromise(command)
        if (result.stderr) {
            console.error(`exec error: ${result.stderr}`)
            vscode.window.showErrorMessage('Error on phpstan command', result.stderr)
            return
        }

        return JSON.parse(result.stdout)
    } catch (err) {
        vscode.window.showErrorMessage('Failed to start Docker container.')
        console.error(err)
    }
}

export const phpcsCheck = async (document: vscode.TextDocument) => {
    try {
        const command = buildCommand('phpcs-check', document, [
            '-q',
            '--report=json'
        ])
        const result = await execPromise(command)
        if (result.stderr) {
            console.error(`exec error: ${result.stderr}`)
            vscode.window.showErrorMessage('Error on phpcs command', result.stderr)
            return
        }

        return JSON.parse(result.stdout)
    } catch (err) {
        vscode.window.showErrorMessage('Failed to start Docker container.')
        console.error(err)
    }
}

export const psalmCheck = async (document: vscode.TextDocument) => {
    try {
        const command = buildCommand('psalm-check', document, [
            '--output-format=json'
        ])
        console.log(command)
        const result = await execPromise(command)
        console.log('result', result)
        if (result.stderr) {
            console.error(`exec error: ${result.stderr}`)
            vscode.window.showErrorMessage('Error on psalm command', result.stderr)
            return
        }

        return JSON.parse(result.stdout)

    } catch (err) {
        vscode.window.showErrorMessage('Failed to start Docker container.')
        console.error(err)
    }
}
