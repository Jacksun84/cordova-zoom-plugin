const fs = require("fs");
const path = require("path");

module.exports = function (context) {
    const projectRoot = context.opts.projectRoot;

    const gradlePropertiesPath = path.join(
        projectRoot,
        "platforms",
        "android",
        "gradle.properties"
    );

    if (!fs.existsSync(gradlePropertiesPath)) {
        console.log("[Zoom Plugin] gradle.properties not found:");
        console.log(gradlePropertiesPath);
        return;
    }

    let content = fs.readFileSync(gradlePropertiesPath, "utf8");

    const jvmArgs = "org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m";

    if (/^org\.gradle\.jvmargs=.*$/m.test(content)) {
        console.log("Found org.gradle.jvmargs property.");
        content = content.replace(
            /^org\.gradle\.jvmargs=.*$/m,
            jvmArgs
        );
    } else {
        content += `\n${jvmArgs}\n`;
    }

    fs.writeFileSync(gradlePropertiesPath, content);

    console.log(
        "[Zoom Plugin] Gradle JVM memory configured: 4 GB:", content
    );
};