import * as vscode from 'vscode'
import { phpStanCheck, phpcsCheck } from './tools'

const createDiagnostics = (issues: any[]) => {
	const diagnostics: vscode.Diagnostic[] = []
	issues.forEach(issue => {
		const range = new vscode.Range(
			new vscode.Position(issue.line_from - 1, issue.from),
			new vscode.Position(issue.line_to - 1, issue.to)
		)
		diagnostics.push(new vscode.Diagnostic(range, issue.message, vscode.DiagnosticSeverity.Error))
	})
	return diagnostics
}

export function activate(context: vscode.ExtensionContext) {
	const diagnosticCollection = vscode.languages.createDiagnosticCollection('psalm')

	context.subscriptions.push(vscode.commands.registerCommand('super-code-tools.run', () => {
		vscode.window.showInformationMessage('Welcome to Super Code Tools!')
	}))

	vscode.workspace.onDidSaveTextDocument(async (document) => {
		console.log('File saved:', document.uri.fsPath)
		const path = document.uri.fsPath
		if (!path.includes('.git') && path.includes('.php') && !path.includes('vendor') && !path.includes('node_modules')) {
			// psalmCheck(document)
			// const issues = await phpcsCheck(document)
			const issues = await phpStanCheck(document)
			console.log(issues)
			// diagnosticCollection?.set(document.uri, createDiagnostics(issues))
		}
	})

	vscode.workspace.onDidOpenTextDocument(async (document) => {
		console.log('File opened:', document.uri.fsPath)
		const path = document.uri.fsPath
		if (!path.includes('.git') && path.includes('.php') && !path.includes('vendor') && !path.includes('node_modules')) {
			// psalmCheck(document)
			const issues = await phpStanCheck(document)
		}
	})
}
