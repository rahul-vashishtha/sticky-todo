/*
 * File: MainWindow.ts
 * Project: sticky-todo
 * File Created: Friday, 15th May 2020 12:30:02 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import UI = require("@nodegui/nodegui");
import fs = require("fs");
import path = require("path");
import { Utils } from "../helpers/Utils";
import { ToDoItem } from "../components/ToDoItem";

export class MainWindow extends UI.QMainWindow {
    private todoListWidget!: UI.QWidget;

    constructor() {
        super();

        this.initializeComponents();
    }

    /**
     * This method initializes all the UI components required to be loaded initially.
     * This can be overriden by the child class of this class
     */
    protected initializeComponents() {
        this.setWindowTitle("Sticky Todo");
        this.setMinimumSize(300, 300);
        this.setStyleSheet(fs.readFileSync(path.resolve(__dirname, "../assets/styles/style.css"), "utf8"));
        this.setWindowIcon(new UI.QIcon(path.resolve(__dirname, "../assets/images/logo.png")));
        this.setWindowFlag(UI.WindowType.WindowMaximizeButtonHint, false);

        const centralWidget = new UI.QWidget();
        centralWidget.setInlineStyle(`
            height: '100%';
            margin: 0px;
            padding: 0px;
        `);
        centralWidget.setLayout(new UI.QGridLayout());
        centralWidget.layout?.setContentsMargins(5, 0, 5, 0);
        this.setCentralWidget(centralWidget);

        const headerWidget = new UI.QWidget();
        headerWidget.setMinimumSize(300, 40);
        headerWidget.setMaximumSize(1920, 40);
        headerWidget.setLayout(new UI.QBoxLayout(UI.Direction.RightToLeft));
        headerWidget.layout?.setContentsMargins(0, 0, 0, 0);
        headerWidget.setInlineStyle(`margin-top: 5px;`)

        this.todoListWidget = new UI.QWidget();
        this.todoListWidget.setInlineStyle(`
            flex-direction: column;
        `);
        this.todoListWidget.setLayout(new UI.FlexLayout());

        const addBtn = new UI.QPushButton();
        addBtn.setText("+ Add New Item");
        addBtn.setMinimumSize(150, 35);
        addBtn.setMaximumSize(150, 35);
        addBtn.setCursor(UI.CursorShape.PointingHandCursor);
        addBtn.setInlineStyle(`
            font-size: 13px;
            font-weight: 300;
            border-radius: 4px;
        `);
        addBtn.addEventListener("clicked", this.addToDoItem.bind(this));

        (headerWidget.layout as UI.QBoxLayout).addStretch();
        headerWidget.layout?.addWidget(addBtn);
        (headerWidget.layout as UI.QBoxLayout).addStretch();

        centralWidget.layout?.addWidget(headerWidget, 0, 0);
        centralWidget.layout?.addWidget(this.todoListWidget, 1, 0);
    }

    private addToDoItem(): void {
        Utils.getInputFromDialog("Enter item", "Enter the item to add", (input) => {

            if (!Utils.isEmptyorWhitespace(input)) {

                const item = new ToDoItem(input);
                item.onDeleteClicked(() => {
                    console.log("delete called");
                    this.todoListWidget.layout!.removeWidget(item);
                    this.todoListWidget.update();
                });

                this.todoListWidget.layout?.addWidget(item);
            }
        });
    }
}