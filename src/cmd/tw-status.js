#!/usr/bin/env babel-node --

import TeamworkCLI from "../src/TeamworkCLI";

var currentProject = TeamworkCLI.getCurrent("project"),
    currentTasklist = TeamworkCLI.getCurrent("tasklist"),
    currentUser = TeamworkCLI.getCurrent("user"),
    currentInstallation = TeamworkCLI.getCurrent("installation"),
    currentTask = TeamworkCLI.getCurrent("task");

var userString;

if(currentUser) {
    userString = `${TeamworkCLI.color.green(currentUser.getNameInitialed())} logged into ${TeamworkCLI.color.magenta(currentInstallation.name)} (${currentInstallation.domain})`
}

TeamworkCLI.log(
`${userString || "Not logged in."}
${TeamworkCLI.color.blue("Project:")} ${currentProject ? currentProject.name : "None"}
${TeamworkCLI.color.blue("Tasklist:")} ${currentTasklist ? currentTasklist.name : "None"}
${TeamworkCLI.color.blue("Task:")} ${currentTask ? currentTask.toString() : "None"}`)