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
import { SelectionMode } from "@nodegui/nodegui/dist/lib/QtWidgets/QAbstractItemView";
import { TitleBar } from "../components/TitleBar";
import { Button } from "../components/Button";
import { SettingsWindow } from "./SettingsWindow";
import moment from "moment";
import { ListManager } from "../helpers/ListManager";

export class MainWindow extends UI.QMainWindow {
    private todoListWidget!: UI.QListWidget;
    private items: UI.QListWidgetItem[] = [];

    constructor(private listID: string = "default") {
        super();

        this.initializeComponents();

        this.loadTasks();
    }

    /**
     * This method initializes all the UI components required to be loaded initially.
     * This can be overriden by the child class of this class
     */
    protected initializeComponents() {
        this.setWindowTitle("Sticky Todo");
        this.setMinimumSize(320, 320);
        this.setStyleSheet(fs.readFileSync(path.resolve(__dirname, "../assets/styles/style.css"), "utf8"));
        this.setWindowIcon(new UI.QIcon(path.resolve(__dirname, "../assets/images/logo.png")));
        this.setWindowFlag(UI.WindowType.WindowMaximizeButtonHint, false);
        this.setWindowFlag(UI.WindowType.FramelessWindowHint, true);
        this.setAttribute(UI.WidgetAttribute.WA_TranslucentBackground, true);

        const centralWidget = new UI.QWidget();
        centralWidget.setInlineStyle(`
            height: '100%';
            margin: 0px;
            padding: 0px;
            background-color: transparent;
            border: 0px;
        `);
        centralWidget.setLayout(new UI.QGridLayout());
        centralWidget.layout?.setContentsMargins(10, 10, 10, 10);
        this.setCentralWidget(centralWidget);

        const baseWidget = new UI.QWidget();
        baseWidget.setInlineStyle(`
            height: '100%';
            margin: 0px;
            padding: 0px;
            background-color: white;
            border: 0px;
            border-radius: 6px;
        `);
        baseWidget.setLayout(new UI.QGridLayout());
        baseWidget.layout?.setContentsMargins(5, 0, 5, 5);
        centralWidget.layout?.addWidget(baseWidget);

        // Add drop shadow to baseWidget
        let dropShadow: UI.QGraphicsDropShadowEffect = new UI.QGraphicsDropShadowEffect();
        dropShadow.setBlurRadius(10);
        dropShadow.setColor(new UI.QColor(("#20000000")));
        dropShadow.setXOffset(0);
        dropShadow.setYOffset(0);
        baseWidget.setGraphicsEffect(dropShadow);

        this.todoListWidget = new UI.QListWidget();
        this.todoListWidget.setInlineStyle(`
            border: 0px;
            background: white;
        `);
        this.todoListWidget.setSelectionMode(SelectionMode.NoSelection);

        const toolbarWidget = new UI.QWidget();
        toolbarWidget.setMinimumSize(300, 40);
        toolbarWidget.setMaximumSize(1920, 40);
        toolbarWidget.setLayout(new UI.QBoxLayout(UI.Direction.LeftToRight));
        toolbarWidget.layout?.setContentsMargins(0, 0, 0, 0);
        toolbarWidget.setInlineStyle(`
            margin-top: 5px;
            background: white;
        `);

        const btnAddItem = new Button();
        btnAddItem.setText("+ Add New Item");
        btnAddItem.setMinimumSize(140, 35);
        btnAddItem.setMaximumSize(1920, 35);
        btnAddItem.setCursor(UI.CursorShape.PointingHandCursor);
        btnAddItem.setProperty("type", "secondary");
        btnAddItem.setInlineStyle(`
            font-size: 13px;
            font-weight: 300;
            border-radius: 4px;
            border: 0;
        `);
        btnAddItem.addEventListener("clicked", this.addToDoItem.bind(this));

        const btnSettings = new Button();
        btnSettings.setText("Settings");
        btnSettings.setMinimumSize(140, 35);
        btnSettings.setMaximumSize(1920, 35);
        btnSettings.setCursor(UI.CursorShape.PointingHandCursor);
        btnSettings.setProperty("type", "secondary");
        btnSettings.setInlineStyle(`
            font-size: 13px;
            font-weight: 300;
            border-radius: 4px;
            border: 0;
        `);
        btnSettings.addEventListener("clicked", this.showSettings.bind(this));

        (toolbarWidget.layout as UI.QBoxLayout).addSpacing(5);
        toolbarWidget.layout?.addWidget(btnAddItem);
        (toolbarWidget.layout as UI.QBoxLayout).addSpacing(5);
        toolbarWidget.layout?.addWidget(btnSettings);
        (toolbarWidget.layout as UI.QBoxLayout).addSpacing(5);

        baseWidget.layout?.addWidget(new TitleBar(this), 0, 0);         // Add Title Bar
        baseWidget.layout?.addWidget(this.todoListWidget, 1, 0);
        baseWidget.layout?.addWidget(toolbarWidget, 2, 0);

        this.addSizeGripHandle();
    }

    private addToDoItem(): void {
        Utils.getInputFromDialog("Enter item", "Enter the item to add", (input) => {

            if (!Utils.isEmptyorWhitespace(input)) {
                const taskObj = this.getTaskObject(input);
                const item = new UI.QListWidgetItem();
                const toDoItem = new ToDoItem(taskObj);
                item.setSizeHint(toDoItem.minimumSize());

                toDoItem.onDeleteClicked(() => {
                    const index = this.items.indexOf(item);
                    this.todoListWidget.removeItemWidget(item);
                    this.todoListWidget.takeItem(index);
                    this.todoListWidget.update();

                    this.items.splice(index, 1);

                    ListManager.removeTaskFromList(this.listID, taskObj.taskID);
                });

                toDoItem.onTaskUpdate((updatedInput) => {
                    taskObj.taskName = updatedInput;

                    ListManager.updateTaskInList(this.listID, taskObj);
                });

                toDoItem.onCheckToggle((checked) => {
                    taskObj.isChecked = checked;

                    ListManager.updateTaskInList(this.listID, taskObj);
                });

                ListManager.addTaskToList(this.listID, taskObj);

                this.todoListWidget.addItem(item);
                this.todoListWidget.setItemWidget(item, toDoItem);

                this.items.push(item);
            }
        });
    }

    private loadTasks(): void {
        const tasks = ListManager.getList(this.listID).tasks as Array<any>;

        tasks.forEach((taskObj) => {
            const item = new UI.QListWidgetItem();
            const toDoItem = new ToDoItem(taskObj);
            item.setSizeHint(toDoItem.minimumSize());

            toDoItem.onDeleteClicked(() => {
                const index = this.items.indexOf(item);
                this.todoListWidget.removeItemWidget(item);
                this.todoListWidget.takeItem(index);
                this.todoListWidget.update();

                this.items.splice(index, 1);

                ListManager.removeTaskFromList(this.listID, taskObj.taskID);
            });

            toDoItem.onTaskUpdate((updatedInput) => {
                taskObj.taskName = updatedInput;

                ListManager.updateTaskInList(this.listID, taskObj);
            });

            toDoItem.onCheckToggle((checked) => {
                taskObj.isChecked = checked;

                ListManager.updateTaskInList(this.listID, taskObj);
            });

            this.todoListWidget.addItem(item);
            this.todoListWidget.setItemWidget(item, toDoItem);

            this.items.push(item);
        });
    }

    private getTaskObject(taskName: string): any {
        return {
            taskID: moment().format('YYYYMMDDhmmssa'),
            taskName: taskName,
            isChecked: false,
            createdDT: moment().format()
        };
    }

    private showSettings(): void {
        let settings = new SettingsWindow();
        settings.show();
    }

    private addSizeGripHandle(): void {
        const sizeGripHandle: UI.QLabel = new UI.QLabel(this);
        sizeGripHandle.setCursor(UI.CursorShape.SizeFDiagCursor);
        sizeGripHandle.setGeometry(335, 305, 10, 10);

        this.makeResizable(sizeGripHandle);
    }

    private makeResizable(sizeGripHandle: UI.QWidget): void {
        const cursor = new UI.QCursor();
        let offset: UI.QPoint;
        let windowCurrGeometry: UI.QRect;

        sizeGripHandle.addEventListener(UI.WidgetEventTypes.MouseButtonPress, () => {
            offset = this.mapFromParent(new UI.QPoint(cursor.pos().x, cursor.pos().y));
            windowCurrGeometry = this.geometry();
        });

        sizeGripHandle.addEventListener(UI.WidgetEventTypes.MouseMove, (data) => {
            let newCursorPosition = this.mapFromParent(new UI.QPoint(cursor.pos().x, cursor.pos().y));
            let cursorPosDelta = new UI.QPoint(newCursorPosition.x() - offset.x(), newCursorPosition.y() - offset.y());

            let newWidth = windowCurrGeometry.width() + cursorPosDelta.x();
            let newHeight = windowCurrGeometry.height() + cursorPosDelta.y();

            if (newWidth < this.minimumSize().width() + 30) {
                newWidth = this.minimumSize().width() + 30;
            }

            if (newHeight < this.minimumSize().height()) {
                newHeight = this.minimumSize().height();
            }

            this.resize(newWidth, newHeight);

            sizeGripHandle.move(newWidth - 15, newHeight - 15);
            sizeGripHandle.updateGeometry();
        });
    }
}