import * as vscode from 'vscode'
import { phpStanCheck } from './phpstan'
import { psalmCheck } from './psalm'
import { phpmdCheck } from './phpmd'
import { phpcsCheck } from './phpcs'
import { startContainer, stopContainer } from './command'

export type Issue = {
	lineFrom: number
	lineTo: number
	from: number
	to: number
	message: string
	tool: string
}

const createDiagnostics = (issues: Issue[]) => {
	console.log(issues)
	const diagnostics: vscode.Diagnostic[] = []
	issues.forEach(issue => {
		const range = new vscode.Range(
			new vscode.Position(issue.lineFrom - 1, issue.from),
			new vscode.Position(issue.lineTo - 1, issue.to)
		)
		diagnostics.push(new vscode.Diagnostic(range, `${issue.message} [${issue.tool}]`, vscode.DiagnosticSeverity.Error))
	})
	return diagnostics
}

const runCommands = async (document: vscode.TextDocument) => {
	return [
		...await phpcsCheck(document),
		...await phpStanCheck(document),
		...await psalmCheck(document),
		...await phpmdCheck(document),
	]
}

const checkFiles = (document: vscode.TextDocument) => {
	const path = document.uri.fsPath
	return !path.includes('.git') && path.includes('.php') && !path.includes('vendor') && !path.includes('node_modules')
}

export function activate(context: vscode.ExtensionContext) {
	const diagnosticCollection = vscode.languages.createDiagnosticCollection('super-code-tools')

	context.subscriptions.push(vscode.commands.registerCommand('super-code-tools.run', async () => {
		try {
			await startContainer()
		} catch (error) {
			console.error(error)
			vscode.window.showErrorMessage('Error on start container', error.message)
		}

		vscode.window.showInformationMessage('Welcome to Super Code Tools!')
	}))

	vscode.workspace.onDidSaveTextDocument(async (document) => {
		const issues = await runCommands(document)
		checkFiles(document) && diagnosticCollection?.set(document.uri, createDiagnostics(issues))
	})

	vscode.workspace.onDidOpenTextDocument(async (document) => {
		checkFiles(document) && diagnosticCollection?.set(document.uri, createDiagnostics(await runCommands(document)))
	})

	// stop container when vscode is closed
	context.subscriptions.push(vscode.window.onDidCloseTerminal(() => {
		stopContainer()
	}))
}

export async function deactivate() {
	await stopContainer()
}
