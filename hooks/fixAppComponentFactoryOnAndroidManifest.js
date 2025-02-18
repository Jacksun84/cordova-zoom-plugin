#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

module.exports = function (context) {
    const manifestPath = path.join(
        context.opts.projectRoot,
        "platforms/android/app/src/main/AndroidManifest.xml"
    );

    if (fs.existsSync(manifestPath)) {
        let manifestContent = fs.readFileSync(manifestPath, "utf8");

        if (!manifestContent.includes('tools:replace="android:appComponentFactory"')) {
            console.log("Modifying AndroidManifest.xml...");

            manifestContent = manifestContent.replace(
                /<application(.*?)>/,
                '<application$1 tools:replace="android:appComponentFactory" android:appComponentFactory="androidx.core.app.CoreComponentFactory">'
            );

            fs.writeFileSync(manifestPath, manifestContent, "utf8");
            console.log("AndroidManifest.xml updated successfully.");
        } else {
            console.log("AndroidManifest.xml already contains the required modifications.");
        }
    } else {
        console.error("AndroidManifest.xml not found!");
    }
};