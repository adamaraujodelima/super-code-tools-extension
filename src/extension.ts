import * as vscode from 'vscode'
import { phpStanCheck } from './phpstan'
import { psalmCheck } from './psalm'
import { phpmdCheck } from './phpmd'
import { phpcsCheck } from './phpcs'

export type Issue = {
	lineFrom: number
	lineTo: number
	from: number
	to: number
	message: string
}

const createDiagnostics = (issues: Issue[]) => {
	const diagnostics: vscode.Diagnostic[] = []
	issues.forEach(issue => {
		const range = new vscode.Range(
			new vscode.Position(issue.lineFrom - 1, issue.from),
			new vscode.Position(issue.lineFrom - 1, issue.to)
		)
		diagnostics.push(new vscode.Diagnostic(range, issue.message, vscode.DiagnosticSeverity.Error))
	})
	return diagnostics
}

const runCommands = async (document: vscode.TextDocument) => {
	return [
		...await phpcsCheck(document),
		...await phpmdCheck(document),
		...await phpStanCheck(document),
		...await psalmCheck(document)
	]
}

export function activate(context: vscode.ExtensionContext) {
	const diagnosticCollection = vscode.languages.createDiagnosticCollection('super-code-tools')

	context.subscriptions.push(vscode.commands.registerCommand('super-code-tools.run', () => {
		vscode.window.showInformationMessage('Welcome to Super Code Tools!')
	}))

	vscode.workspace.onDidSaveTextDocument(async (document) => {
		const path = document.uri.fsPath
		if (!path.includes('.git') && path.includes('.php') && !path.includes('vendor') && !path.includes('node_modules')) {
			diagnosticCollection?.set(document.uri, createDiagnostics(await runCommands(document)))
		}
	})

	vscode.workspace.onDidOpenTextDocument(async (document) => {
		const path = document.uri.fsPath
		if (!path.includes('.git') && path.includes('.php') && !path.includes('vendor') && !path.includes('node_modules')) {
			diagnosticCollection?.set(document.uri, createDiagnostics(await runCommands(document)))
		}
	})
}
