/*
 * File: ConfigManager.ts
 * Project: sticky-todo
 * File Created: Sunday, 28th June 2020 9:09:21 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import path from "path";
import fs from "fs";
import ConfigParser = require("configparser");
import moment from "moment";
import os from 'os';

/**
 * Class to manager the application configuration and read/write config & data files.
 */
export class ConfigManager {
    private static config: any = undefined;

    public static Constants = {
        FirstRun: "FirstRun",
        RunAtStartup: "RunAtStartup"
    }
    private static DEFAULT_SECTION = "StickyToDo-Config";

    /**
     * Get the path of the project data directory.
     */
    public static getConfigDirectoryPath(): string {
        return path.join(os.homedir(), ".rinnegan", "sticky-todo");
    }

    /**
     * Gets the path of the configuration file of the application.
     */
    private static getConfigFilePath(): string {
        return path.join(this.getConfigDirectoryPath(), "config.rcfg");
    }

    /**
     * Writes the configuration to config file
     * @param option Key identifier of the configuration
     * @param value Corresponding value to the key
     */
    public static writeConfig(option: string, value: string | boolean | number): void {
        if (this.config === undefined) {
            this.initConfig();
        }

        this.config.set(this.DEFAULT_SECTION, option, value);

        this.config.write(this.getConfigFilePath());
    }

    /**
     * Gets the specific configuration.
     * @param option Key identifier of the configuration
     */
    public static getConfig(option: string): string {
        if (this.config === undefined) {
            this.initConfig();
        }

        return this.config.get(this.DEFAULT_SECTION, option);
    }

    /**
     * Initializes and loads the Configuration.
     */
    public static initConfig(): void {
        this.config = new ConfigParser();

        if (!fs.existsSync(this.getConfigDirectoryPath())) {
            this.createDirectoryStructure(this.getConfigDirectoryPath());
        }

        if (!fs.existsSync(this.getConfigFilePath())) {
            this.writeDefaultConfig();
        }

        this.config.read(this.getConfigFilePath());
    }

    /**
     * Writes the default configuration to the file.
     */
    private static writeDefaultConfig() {
        this.config.addSection(this.DEFAULT_SECTION);
        this.config.set(this.DEFAULT_SECTION, this.Constants.FirstRun, moment().format());
        this.config.set(this.DEFAULT_SECTION, this.Constants.RunAtStartup, false);

        // Write the config to file.
        this.config.write(this.getConfigFilePath());
    }

    /**
     * Creates a directory structure for a directory path, if not exists.
     */
    public static createDirectoryStructure(targetDirPath: string): void {
        fs.mkdirSync(targetDirPath, { recursive: true });
    }
}