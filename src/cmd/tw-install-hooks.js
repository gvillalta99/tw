#!/usr/bin/env babel-node --

import fs from "fs";
import Path from "path";
import Promise from "bluebird";
import TeamworkCLI from "../src/TeamworkCLI";

Promise.promisifyAll(fs);

var gitRepo = Path.resolve(process.env.PWD, ".git");

Promise.try(() => {
    // Check if the current directory is a git repository
    return fs.statAsync(gitRepo);
}).then((stat) => {
    var hooksPath = Path.resolve(__dirname, "../src/hooks"),
        gitHooksPath = Path.join(gitRepo, "hooks");

    TeamworkCLI.log(`Copying hooks from ${hooksPath} to ${gitHooksPath}.`);

    // Git directory, copy all the files in src/hooks into .git/hooks
    return Promise.all(fs.readdirSync(hooksPath).map((hook) => {
        TeamworkCLI.log(`> ${hook}`);

        return new Promise((resolve, reject) => {
            var newHook = Path.join(gitHooksPath, hook);

            fs.createReadStream(Path.join(hooksPath, hook))
                .pipe(fs.createWriteStream(newHook))
                .on("end", () => {
                    TeamworkCLI.log("$ chmod 0755 %s", newHook);
                    fs.chmod(newHook, 0o755, (err) => {
                        if(err) reject(err);
                        else resolve();
                    });
                });
        });
    }));
}).catch((err) => {
    TeamworkCLI.fail("Current directory is not a git repository.");
});