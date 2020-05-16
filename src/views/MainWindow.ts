/*
 * File: MainWindow.ts
 * Project: sticky-todo
 * File Created: Friday, 15th May 2020 12:30:02 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import UI = require("@nodegui/nodegui");
import fs = require("fs");
import path = require("path");

export class MainWindow extends UI.QMainWindow {
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
        this.setMinimumSize(250, 300);
        this.setStyleSheet(fs.readFileSync(path.resolve(__dirname, "../assets/styles/style.css"), "utf8"));
        this.setWindowIcon(new UI.QIcon(path.resolve(__dirname, "../assets/images/logo.png")));

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
        headerWidget.setMinimumSize(250, 40);
        headerWidget.setMaximumSize(1920, 40);
        headerWidget.setLayout(new UI.QBoxLayout(UI.Direction.RightToLeft));
        headerWidget.layout?.setContentsMargins(0, 0, 0, 0);

        const addBtn = new UI.QPushButton();
        addBtn.setText("+");
        addBtn.setMinimumSize(30, 30);
        addBtn.setMaximumSize(30, 30);
        addBtn.setCursor(UI.CursorShape.PointingHandCursor);
        addBtn.addEventListener("clicked", (checked) => {

        })

        headerWidget.layout?.addWidget(addBtn);
        (headerWidget.layout as UI.QBoxLayout).addStretch();

        const todoListWidget = new UI.QWidget();
        todoListWidget.setInlineStyle(`
            flex-direction: column;
        `);
        todoListWidget.setLayout(new UI.FlexLayout());

        centralWidget.layout?.addWidget(headerWidget, 0, 0);
        centralWidget.layout?.addWidget(todoListWidget, 1, 0);
    }
}