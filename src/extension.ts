import * as vscode from 'vscode'
import { phpStanCheck } from './phpstan'
import { psalmCheck } from './psalm'
import { phpmdCheck } from './phpmd'
import { phpcsCheck } from './phpcs'
import { CommandResult, startContainer, stopContainer } from './command'

export type Issue = {
	lineFrom: number
	lineTo: number
	from: number
	to: number
	message: string
	tool: string
}

const decorationType = vscode.window.createTextEditorDecorationType({
	after: {
		margin: '0 0 0 1rem',
		textDecoration: 'none'
	}
})

const diagnostics: vscode.Diagnostic[] = []

const createDiagnostics = (issues: Issue[]) => {
	console.log(issues)
	const editor = vscode.window.activeTextEditor
	const decorationsOptionsArray: vscode.DecorationOptions[] = []

	issues.forEach(issue => {
		const range = new vscode.Range(
			new vscode.Position(issue.lineFrom - 1, issue.from),
			new vscode.Position(issue.lineTo - 1, issue.to)
		)
		diagnostics.push(new vscode.Diagnostic(range, `${issue.message} [${issue.tool}]`, vscode.DiagnosticSeverity.Error))
		if (editor) {
			const decorationOptions: vscode.DecorationOptions = {
				range: new vscode.Range(
					new vscode.Position(issue.lineFrom - 1, issue.to),
					new vscode.Position(issue.lineFrom - 1, issue.to)
				),
				renderOptions: {
					after: {
						contentText: `[${issue.tool}] ${issue.message}`,
						color: 'rgba(255, 0, 0, 0.8)' // You can customize the color
					}
				}
			}
			decorationsOptionsArray.push(decorationOptions)
		}
	})

	// if (editor) {
	// 	editor.setDecorations(decorationType, decorationsOptionsArray)
	// }
}

const checkFiles = (document: vscode.TextDocument) => {
	const path = document.uri.fsPath

	return !path.includes('.git') &&
		path.includes('.php') &&
		!path.includes('vendor') &&
		!path.includes('node_modules') &&
		!path.includes('.vscode') &&
		!path.match(/commit~\w+/)
}

export async function activate(context: vscode.ExtensionContext) {
	try {
		await startContainer()

		const diagnosticCollection = vscode.languages.createDiagnosticCollection('SuperCodeTools')
		context.subscriptions.push(diagnosticCollection)

		const runCommands = async (document: vscode.TextDocument) => {
			diagnosticCollection.clear()
			diagnostics.length = 0
			Promise.all([
				phpcsCheck(document),
				phpStanCheck(document),
				psalmCheck(document),
				phpmdCheck(document)
			]).then((issues) => {
				const allIssues = issues.flat()
				createDiagnostics(allIssues)
				diagnosticCollection.set(document.uri, diagnostics)
			})
		}

		vscode.workspace.onDidSaveTextDocument(async (document) => {
			if (checkFiles(document)) {
				runCommands(document)
			}
		})

		vscode.workspace.onDidOpenTextDocument(async (document) => {
			if (checkFiles(document)) {
				runCommands(document)
			}
		})
	} catch (err) {
		console.error(err)
		const error = err as CommandResult
		vscode.window.showErrorMessage('Error on start container', error.stderr)
	}
}

export async function deactivate() {
	await stopContainer()
}
