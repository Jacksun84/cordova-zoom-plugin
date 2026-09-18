const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
    const gradlePropertiesPath = path.join(platformRoot, 'gradle.properties');

    // Increase JVM memory
    const propertiesToAppend = [
        '',
        '# Added by Zoom Plugin hook',
        'org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m',
        'android.defaults.buildfeatures.buildconfig=true',
        'android.nonFinalResIds=false',
        'android.nonTransitiveRClass=false'
    ].join('\n');

    if (fs.existsSync(gradlePropertiesPath)) {
        let content = fs.readFileSync(gradlePropertiesPath, 'utf8');

        console.log(' --- ✅ --- Gradle properties path: ', gradlePropertiesPath);
        console.log(' --- 🔍 --- Current gradle properties content:\n', content);

        // Replace existing low jvmargs (like -Xmx2048m) with higher memory
        if (content.includes('org.gradle.jvmargs')) {
            content = content.replace(/org\.gradle\.jvmargs=.*/g, 'org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m');
        } else {
            content += propertiesToAppend;
        }
        console.log(' --- 🧩 --- Updated gradle properties:\n', content);

        fs.writeFileSync(gradlePropertiesPath, content, 'utf8');
        console.log('--- ✅ --- Successfully allocated 4GB heap memory in ', gradlePropertiesPath);
    } else {
        console.warn('gradle.properties not found at: ' + gradlePropertiesPath);
    }
};