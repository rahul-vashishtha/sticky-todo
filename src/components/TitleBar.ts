/*
 * File: TitleBar.ts
 * Project: sticky-todo
 * File Created: Sunday, 21st June 2020 10:13:00 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import UI = require("@nodegui/nodegui");

export class TitleBar extends UI.QWidget {
    private lblTitle?: UI.QLabel;
    private btnMinimize?: UI.QPushButton;
    private btnClose?: UI.QPushButton;

    private showMinimizeButton: boolean = true;
    private showCloseButton: boolean = true;

    public get ShowMinimizeButton(): boolean {
        return this.showMinimizeButton;
    }
    public set ShowMinimizeButton(value: boolean) {
        this.showMinimizeButton = value;

        if (value) {
            this.btnMinimize?.show();
        }
        else {
            this.btnMinimize?.hide();
        }
    }

    public get ShowCloseButton(): boolean {
        return this.showCloseButton;
    }
    public set ShowCloseButton(value: boolean) {
        this.showCloseButton = value;

        if (value) {
            this.btnClose?.show();
        }
        else {
            this.btnClose?.hide();
        }
    }

    public get Title(): string {
        if (!(this.lblTitle === undefined)) {
            return this.lblTitle.text();
        }

        return "";
    }

    public set Title(value: string) {
        if (this.lblTitle === undefined) {
            throw new Error("TitleBar is not initialized.");
        }
        else {
            this.lblTitle.setText(value);
        }
    }

    constructor(private parent: UI.QMainWindow) {
        super();

        this.initializeComponents();
    }

    private initializeComponents(): void {
        this.setInlineStyle(`
            background-color: white;
            border: 0px;
            border-radius: 6px;
        `);
        this.setMinimumSize(this.parent.minimumSize().width(), 32);
        this.setMaximumSize(this.parent.maximumSize().width(), 32);

        this.makeWindowDraggable();

        const layout = new UI.QBoxLayout(UI.Direction.LeftToRight);
        this.setLayout(layout);
        layout.setContentsMargins(0, 0, 0, 0);

        this.lblTitle = new UI.QLabel();
        this.lblTitle.setText(this.parent.windowTitle());
        this.lblTitle.setInlineStyle(`
            font-size: 12px;
        `);

        layout.addStretch();
        layout.addWidget(this.lblTitle);
        layout.addStretch();

        this.addMinimizeButton();
        this.addCloseButton();
    }

    private makeWindowDraggable(): void {
        const cursor = new UI.QCursor();
        let offset: UI.QPoint;

        this.addEventListener(UI.WidgetEventTypes.MouseButtonPress, () => {
            offset = this.mapFromGlobal(new UI.QPoint(cursor.pos().x, cursor.pos().y));
        });

        this.addEventListener(UI.WidgetEventTypes.MouseMove, (data) => {
            let newCursorPosition = this.mapFromGlobal(new UI.QPoint(cursor.pos().x, cursor.pos().y));
            let cursorPosDelta = new UI.QPoint(newCursorPosition.x() - offset.x(), newCursorPosition.y() - offset.y());
            let globalPoints = this.mapToGlobal(cursorPosDelta);
            this.parent.move(globalPoints.x(), globalPoints.y());
        });
    }

    private addCloseButton(): void {
        this.btnClose = new UI.QPushButton();
        this.btnClose.setMinimumSize(16, 16);
        this.btnClose.setMaximumSize(16, 16);
        this.btnClose.setProperty("type", "close");
        this.btnClose.addEventListener("clicked", () => {
            this.parent.close();
        });

        this.layout?.addWidget(this.btnClose);
    }

    private addMinimizeButton(): void {
        this.btnMinimize = new UI.QPushButton();
        this.btnMinimize.setMinimumSize(16, 16);
        this.btnMinimize.setMaximumSize(16, 16);
        this.btnMinimize.setProperty("type", "minimize");
        this.btnMinimize.addEventListener("clicked", () => {
            this.parent.setWindowState(UI.WindowState.WindowMinimized);
        });

        this.layout?.addWidget(this.btnMinimize);
    }
}