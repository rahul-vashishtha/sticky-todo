/*
 * File: ToDoItem.ts
 * Project: sticky-todo
 * File Created: Saturday, 16th May 2020 11:13:52 pm
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import * as UI from "@nodegui/nodegui";
import { Utils } from "../helpers/Utils";
import path from "path";

export class ToDoItem extends UI.QWidget {
    private onItemDeleted?: () => void;
    private onTaskUpdated?: (newInput: string) => void;
    private onCheckToggled?: (checked: boolean) => void;

    constructor(private task: any) {
        super();

        this.initializeComponents();
    }

    private initializeComponents() {
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

        const layout = new UI.QBoxLayout(UI.Direction.LeftToRight);
        this.setLayout(layout);

        const checkbox = new UI.QCheckBox();
        checkbox.setText(this.task.taskName);
        checkbox.setChecked(this.task.isChecked);
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

            this.onCheckToggled?.call(this, checked);
        });

        const pixmap: UI.QPixmap = new UI.QPixmap(path.resolve(__dirname, "../assets/images/ic_delete.png"));
        const btnDelete = new UI.QLabel();
        btnDelete.setCursor(UI.CursorShape.PointingHandCursor);
        btnDelete.setPixmap(pixmap.scaled(25, 25, UI.AspectRatioMode.KeepAspectRatio, UI.TransformationMode.SmoothTransformation));
        btnDelete.addEventListener(UI.WidgetEventTypes.MouseButtonRelease, () => {
            this.onItemDeleted?.call(this);
        });

        this.addEventListener(UI.WidgetEventTypes.MouseButtonDblClick, () => {
            Utils.getInputFromDialog("Edit Task", "Enter the updated task", (input) => {
                if (!Utils.isEmptyorWhitespace(input)) {
                    checkbox.setText(input);

                    this.onTaskUpdated?.call(this, input);
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

    public onTaskUpdate(callback: (updatedTask: string) => void): void {
        this.onTaskUpdated = callback;
    }

    public onCheckToggle(callback: (checked: boolean) => void): void {
        this.onCheckToggled = callback;
    }
}