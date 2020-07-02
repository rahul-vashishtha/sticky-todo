/*
 * File: SettingsWindow.ts
 * Project: sticky-todo
 * File Created: Thursday, 2nd July 2020 1:30:59 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import UI = require("@nodegui/nodegui");
import fs from "fs";
import path from "path";
import { TitleBar } from "../components/TitleBar";
import { ConfigManager } from "../helpers/ConfigManager";
import os from 'os';
import AutoLaunch = require('auto-launch');

export class SettingsWindow extends UI.QMainWindow {
    private autoLauncher?: AutoLaunch;

    constructor() {
        super();

        this.initializeComponents();
    }

    /**
     * This method initializes all the UI components required to be loaded initially.
     * This can be overriden by the child class of this class
     */
    protected initializeComponents() {
        this.setWindowTitle("Settings - Sticky Todo");
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
        dropShadow.setColor(new UI.QColor(("#18000000")));
        dropShadow.setXOffset(0);
        dropShadow.setYOffset(0);
        baseWidget.setGraphicsEffect(dropShadow);

        const optionsWidget = new UI.QWidget();
        optionsWidget.setLayout(new UI.QBoxLayout(UI.Direction.TopToBottom));
        optionsWidget.layout?.setContentsMargins(10, 10, 10, 10);
        optionsWidget.setInlineStyle(`
            margin-top: 5px;
            background: white;
        `);

        // Initialize Auto Launch before RunAtStartup Setting.
        this.initAutoLaunch();

        optionsWidget.layout?.addWidget(this.initRunAtStartup());

        (optionsWidget.layout as UI.QBoxLayout).addStretch();

        baseWidget.layout?.addWidget(new TitleBar(this), 0, 0);         // Add Title Bar
        baseWidget.layout?.addWidget(optionsWidget, 1, 0);         // Add Tool Bar
        this.addSizeGripHandle();
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

    private initRunAtStartup(): UI.QWidget {
        const runAtStartup: UI.QCheckBox = new UI.QCheckBox();
        runAtStartup.setText("Run at system startup");

        if (ConfigManager.getConfig(ConfigManager.Constants.RunAtStartup) === "true") {
            runAtStartup.setChecked(true);
        }

        runAtStartup.addEventListener("toggled", (checked) => {
            if (checked) {
                this.autoLauncher?.enable();
            }
            else {
                this.autoLauncher?.disable();
            }

            ConfigManager.writeConfig(ConfigManager.Constants.RunAtStartup, checked);
        });

        return runAtStartup;
    }

    private initAutoLaunch(): void {
        var executablePath = path.resolve(__dirname, "../", "Sticky-ToDo.exe");

        if (os.platform() === "linux") {
            executablePath = path.resolve(__dirname, "../", 'sticky-todo');
        }

        this.autoLauncher = new AutoLaunch({
            name: "Sticky To-Do",
            path: executablePath
        });
    }
}