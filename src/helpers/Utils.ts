/*
 * File: Utils.ts
 * Project: sticky-todo
 * File Created: Saturday, 23rd May 2020 12:16:30 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import { QInputDialog, InputMode } from "@nodegui/nodegui";

export class Utils {
    public static getInputFromDialog(title: string, labelText: string, onAcceptCallback: (s: string) => void): void {
        const input = new QInputDialog();
        input.setInputMode(InputMode.TextInput);
        input.setWindowTitle(title);
        input.setLabelText(labelText);
        input.addEventListener("accepted", () => {
            onAcceptCallback(input.textValue());
            return;
        });
        input.exec();
    }

    public static isEmptyorWhitespace(str: string): boolean {
        return (str.trim().length === 0)
    }
}