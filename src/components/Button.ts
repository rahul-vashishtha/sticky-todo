/*
 * File: Button.ts
 * Project: sticky-todo
 * File Created: Sunday, 28th June 2020 7:16:33 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import UI = require("@nodegui/nodegui");

export class Button extends UI.QPushButton {
    private buttonHoverGraphics!: UI.QGraphicsEffect<any>;
    private buttonNormalGraphics!: UI.QGraphicsEffect<any>;

    constructor() {
        super();

        this.initHoverGraphics();
        this.initNormalGraphics();

        this.setGraphicsEffect(this.buttonNormalGraphics);
        this.initNormalGraphics();          // Initialize again to re-apply on hover leave.

        this.addEventListener(UI.WidgetEventTypes.HoverEnter, this.onHoverEnter.bind(this));
        this.addEventListener(UI.WidgetEventTypes.HoverLeave, this.onHoverLeave.bind(this));
    }

    protected initHoverGraphics(): void {
        this.buttonHoverGraphics = new UI.QGraphicsDropShadowEffect();
        (this.buttonHoverGraphics as UI.QGraphicsDropShadowEffect).setBlurRadius(10);
        (this.buttonHoverGraphics as UI.QGraphicsDropShadowEffect).setColor(new UI.QColor(("#32000000")));
        (this.buttonHoverGraphics as UI.QGraphicsDropShadowEffect).setXOffset(1);
        (this.buttonHoverGraphics as UI.QGraphicsDropShadowEffect).setYOffset(1);
    }

    protected initNormalGraphics(): void {
        this.buttonNormalGraphics = new UI.QGraphicsDropShadowEffect();
        (this.buttonNormalGraphics as UI.QGraphicsDropShadowEffect).setBlurRadius(5);
        (this.buttonNormalGraphics as UI.QGraphicsDropShadowEffect).setColor(new UI.QColor(("#22000000")));
        (this.buttonNormalGraphics as UI.QGraphicsDropShadowEffect).setXOffset(0);
        (this.buttonNormalGraphics as UI.QGraphicsDropShadowEffect).setYOffset(0);
    }

    protected onHoverEnter(): void {
        this.setGraphicsEffect(this.buttonHoverGraphics);
        this.initHoverGraphics();
    }

    protected onHoverLeave(): void {
        this.setGraphicsEffect(this.buttonNormalGraphics)
        this.initNormalGraphics();
    }
}