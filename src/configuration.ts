import * as vscode from 'vscode'

export const readConfig = (key: string): any => {
    if (!vscode.workspace.getConfiguration('superCodeTools').has(key)) {
        return null
    }

    return vscode.workspace.getConfiguration('superCodeTools').get(key)
}
