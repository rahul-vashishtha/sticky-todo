/*
 * File: ListManager.ts
 * Project: sticky-todo
 * File Created: Sunday, 28th June 2020 11:51:51 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

import path from 'path';
import fs from 'fs';
import { ConfigManager } from './ConfigManager';
import moment from 'moment';

export class ListManager {
    private static jsonConfig: any = {};

    private static getListFilePath() {
        return path.join(ConfigManager.getConfigDirectoryPath(), "lists.json");
    }

    /**
     * Creates and adds a new to the collection.
     */
    public static addList(listName: string) {
        this.jsonConfig[moment().format('YYYYMMDDhmmssa')] = {
            listName: listName,
            tasks: []
        };

        this.updateFile();
    }

    /**
     * Gets all the available list if name not provided, else name list.
     * @returns Returns null if list not found.
     */
    public static getList(listID?: string): any {
        if (listID === undefined) {
            return this.jsonConfig;
        }
        else {
            return this.jsonConfig[listID];
        }
    }

    /**
     * Removes a list from the collection.
     */
    public static removeList(listID: string) {
        delete this.jsonConfig[listID];

        this.updateFile();
    }

    /**
     * Add a task to the list.
     */
    public static addTaskToList(listID: string, task: any) {
        if (this.jsonConfig === undefined) {
            this.initList();
        }

        this.jsonConfig[listID].tasks.push(task);

        this.updateFile();
    }

    /**
     * Looks for existing task and update it. Creates new task, if task does not exist.
     * @param listID ID of the list
     * @param task Updated task. (Task ID must not be changed).
     */
    public static updateTaskInList(listID: string, task: any) {
        if (this.jsonConfig === undefined) {
            this.initList();
        }

        const index = this.jsonConfig[listID].tasks.findIndex((t: any) => t.taskID == task.taskID);

        if (index < 0) {
            this.addTaskToList(listID, task);
        }
        else {
            this.jsonConfig[listID].tasks[index] = task;

            this.updateFile();
        }
    }

    public static removeTaskFromList(listID: string, taskID: string) {
        if (this.jsonConfig === undefined) {
            this.initList();
        }

        this.jsonConfig[listID].tasks.forEach((task: any, index: number) => {
            if (task.taskID == taskID) {
                this.jsonConfig[listID].tasks.splice(index, 1);
                return;
            }
        });

        this.updateFile();
    }

    public static initList(): void {
        if (!fs.existsSync(this.getListFilePath())) {
            fs.writeFileSync(this.getListFilePath(), JSON.stringify({
                "default": {
                    listName: "default",
                    tasks: [
                        {
                            taskID: moment().format('YYYYMMDDhmmssa'),
                            taskName: "Welcome to Sticky To-Do",
                            isChecked: false,
                            createdDT: moment().format()
                        }
                    ]
                }
            }), { encoding: "utf8" });
        }

        this.jsonConfig = JSON.parse(fs.readFileSync(this.getListFilePath(), { encoding: 'utf8' }));
    }

    private static updateFile(): void {
        fs.writeFileSync(this.getListFilePath(), JSON.stringify(this.jsonConfig), { encoding: "utf8" });
    }
}