/*
 * File: index.ts
 * Project: sticky-todo
 * File Created: Friday, 15th May 2020 12:30:02 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import UI = require("@nodegui/nodegui");
import { MainWindow } from "./views/MainWindow";
import { ConfigManager } from "./helpers/ConfigManager";
import { ListManager } from "./helpers/ListManager";

class Application {
  constructor() {
    this.loadAssets();
  }

	/**
	 * Load application wide assets.
	 */
  private loadAssets(): void {
    UI.QFontDatabase.addApplicationFont("../assets/fonts/NotoSans-Regular.ttf");
  }

  public start(): void {
    // Initialize and load Configurations
    ConfigManager.initConfig();

    // Initialize and load Lists
    ListManager.initList();

    let mainWindow: MainWindow = new MainWindow();
    mainWindow.show();

    this.GlobalWindow = mainWindow;
  }

	/**
	 * Return the current global windows.
	 */
  public get GlobalWindow(): UI.QMainWindow {
    return (global as any).win;
  }

	/**
	 * Saves Window in Global variable to prevent it collected by GC.
	 */
  public set GlobalWindow(v: UI.QMainWindow) {
    (global as any).win = v;
  }
}

const application = new Application();
application.start();