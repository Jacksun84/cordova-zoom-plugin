module.exports = function (context) {
    const fs = require('fs');
    const path = require('path');

    // 1. Fetch preference value from fetch.json or config.xml
    const fetchJsonPath = path.join(context.opts.projectRoot, 'plugins', 'fetch.json');
    let sdkPassword = process.env.ANDROID_ZOOM_SDK_PASSWORD;

    if (!sdkPassword && fs.existsSync(fetchJsonPath)) {
        const fetchJson = JSON.parse(fs.readFileSync(fetchJsonPath, 'utf-8'));
        const pluginData = fetchJson['cordova.plugin.zoom'];
        if (pluginData && pluginData.variables) {
            sdkPassword = pluginData.variables.ANDROID_ZOOM_SDK_PASSWORD;
        }
    }

    if (sdkPassword) {
        // 2. Append to platforms/android/gradle.properties
        const gradlePropsPath = path.join(context.opts.projectRoot, 'platforms', 'android', 'gradle.properties');
        if (fs.existsSync(gradlePropsPath)) {
            let content = fs.readFileSync(gradlePropsPath, 'utf-8');
            if (!content.includes('ANDROID_ZOOM_SDK_PASSWORD')) {
                content += `\nANDROID_ZOOM_SDK_PASSWORD=${sdkPassword}\n`;
                fs.writeFileSync(gradlePropsPath, content, 'utf-8');
                console.log('✅ Successfully added ANDROID_ZOOM_SDK_PASSWORD to gradle.properties');
            }
        }
    } else {
        console.warn('⚠️ ANDROID_ZOOM_SDK_PASSWORD variable was not provided!');
    }
};