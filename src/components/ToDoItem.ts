/*
 * File: ToDoItem.ts
 * Project: sticky-todo
 * File Created: Saturday, 16th May 2020 11:13:52 pm
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import * as UI from "@nodegui/nodegui";
import { Utils } from "../helpers/Utils";

export class ToDoItem extends UI.QWidget {
    private onItemDeleted?: () => void;

    constructor(private text: string) {
        super();

        this.initializeComponents();
    }

    private initializeComponents() {
        const layout = new UI.QBoxLayout(UI.Direction.LeftToRight);
        this.setLayout(layout);
        this.setMinimumSize(290, 50);
        this.setMaximumSize(1920, 50);
        this.setInlineStyle(`
            border-radius: 6px;
            background: white;
            border: 2px outset #EEEEEE;
            margin: 5px;
            padding-left: 10px;
            padding-right: 10px;
        `);

        const checkbox = new UI.QCheckBox();
        checkbox.setText(this.text);
        checkbox.addEventListener("toggled", (checked) => {
            if (checked) {
                checkbox.setInlineStyle(`
                    color: #999;
                    text-decoration: line-through;
                    font-style: italic;
                `);
            }
            else {
                checkbox.setInlineStyle(`
                    color: #1B1B1B;
                    text-decoration: '';
                    font-style: normal;
                `);
            }
        });

        const btnDelete = new UI.QLabel();
        btnDelete.setText("X");
        btnDelete.setCursor(UI.CursorShape.PointingHandCursor);
        btnDelete.addEventListener(UI.WidgetEventTypes.MouseButtonRelease, () => {
            this.onItemDeleted?.call(this);
        });

        this.addEventListener(UI.WidgetEventTypes.MouseButtonDblClick, () => {
            Utils.getInputFromDialog("Edit Task", "Enter the updated task", (input) => {
                if (!Utils.isEmptyorWhitespace(input)) {
                    checkbox.setText(input);
                }
            });
        });

        layout.addSpacing(10);
        layout.addWidget(checkbox);
        layout.addSpacing(10);
        layout.addStretch();
        layout.addWidget(btnDelete);
        layout.addSpacing(10);
    }

    public onDeleteClicked(callback: () => void): void {
        this.onItemDeleted = callback;
    }
}