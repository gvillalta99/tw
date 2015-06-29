#!/usr/bin/env babel-node --

import program from "commander";
import Promise from "bluebird";
import moment from "moment";
import Teamwork from "../src/Teamwork";
import TeamworkCLI, { CLIError } from "../src/TeamworkCLI";
import TeamworkAPI, { LoginError } from "../src/TeamworkAPI";
import { Debug } from "../src/library/Debug";

const debug = Debug("tw:cmd:log");

program
    .arguments("<task> <timestamp>")
    .option("-m, --message <message>", "Log time with a message")
    .option("-d, --duration <duration>", "The duration of the log.")
    .option("-t, --time <time>", "The time the log happened.")
    .option("--date <date>", "The date of the time log.")
    .option("--silent", "Don't prompt for a log message")
    .parse(process.argv);

TeamworkCLI.getAPI().then((api) => {
    return Promise.try(() => {
        var task;

        if(program.args[0]) {
            // Get the task ID
            task = Teamwork.parseTask(program.args[0]);

            // We have a task ID, let's get it. Supplied tasks
            // always have precedence over the current task.
            return api.getTaskByID(task);
        } else {
            task = TeamworkCLI.getCurrent("task")

            if(!task) throw new CLIError("No specified or current task.");
            else return task;
        }
    }).then((task) => {
        TeamworkCLI.log(task.toItem());
        return api.getLogs(task);
    }).then((logs) => {
        if(logs.length) {
            logs.forEach((log, i) => {
                TeamworkCLI.log(`#${i + 1} ` + log.toListItem());
            });
        } else {
            TeamworkCLI.log(TeamworkCLI.color.red("No time logged."));
        }
    });
}).catch(TeamworkCLI.fail);
