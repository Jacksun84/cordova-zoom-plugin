const fs = require("fs");
const path = require("path");

function setProperty(content, key, value) {
    const escaped = key.replace(/\./g, "\\.");
    const regex = new RegExp("^" + escaped + "=.*$", "m");
    const line = `${key}=${value}`;

    if (regex.test(content)) {
        return content.replace(regex, line);
    }
    if (content.length > 0 && !content.endsWith("\n")) {
        content += "\n";
    }
    return content + line + "\n";
}

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

    //const jvmArgs = "org.gradle.jvmargs=-Xmx8192m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError";
    // const jvmArgs = "org.gradle.jvmargs=-Xmx6144m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError";
    
    /*const jvmArgs = "org.gradle.jvmargs=-Xmx4608m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError";
    if (/^org\.gradle\.jvmargs=.*$/m.test(content)) {
        console.log("Found org.gradle.jvmargs property.\n", content);

        content = content.replace(
            /^org\.gradle\.jvmargs=.*$/m,
            jvmArgs
        );
    } else {
        content += `\n${jvmArgs}\n`;
    }
    */

    content = setProperty(content, "org.gradle.jvmargs",
        "-Xmx4608m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError");
    content = setProperty(content, "org.gradle.workers.max", "1");
    content = setProperty(content, "org.gradle.parallel", "false");
    content = setProperty(content, "kotlin.daemon.jvmargs", "-Xmx1g");

    fs.writeFileSync(gradlePropertiesPath, content);

    console.log(
        "[Zoom Plugin] Gradle JVM memory configured: 6G GB:\n", content
    );
};