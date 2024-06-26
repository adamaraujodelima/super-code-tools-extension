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
	tool: string
}

const createDiagnostics = (issues: Issue[]) => {
	const diagnostics: vscode.Diagnostic[] = []
	issues.forEach(issue => {
		const range = new vscode.Range(
			new vscode.Position(issue.lineFrom - 1, issue.from),
			new vscode.Position(issue.lineFrom - 1, issue.to)
		)
		diagnostics.push(new vscode.Diagnostic(range, `${issue.message} [${issue.tool}]`, vscode.DiagnosticSeverity.Error))
	})
	return diagnostics
}

const runCommands = async (document: vscode.TextDocument) => {
	return [
		...await phpcsCheck(document),
		...await psalmCheck(document),
		...await phpStanCheck(document),
		...await phpmdCheck(document),
	]
}

const checkFiles = (document: vscode.TextDocument) => {
	const path = document.uri.fsPath
	return !path.includes('.git') && path.includes('.php') && !path.includes('vendor') && !path.includes('node_modules')
}

export function activate(context: vscode.ExtensionContext) {
	const diagnosticCollection = vscode.languages.createDiagnosticCollection('super-code-tools')

	context.subscriptions.push(vscode.commands.registerCommand('super-code-tools.run', () => {
		vscode.window.showInformationMessage('Welcome to Super Code Tools!')
	}))

	vscode.workspace.onDidSaveTextDocument(async (document) => {
		const issues = await runCommands(document)
		console.log(issues)
		checkFiles(document) && diagnosticCollection?.set(document.uri, createDiagnostics(issues))
	})

	vscode.workspace.onDidOpenTextDocument(async (document) => {
		checkFiles(document) && diagnosticCollection?.set(document.uri, createDiagnostics(await runCommands(document)))
	})
}
