const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    const rootdir = context.opts.projectRoot;
    const configXmlPath = path.join(rootdir, 'config.xml');
    const gradlePropsPath = path.join(rootdir, 'platforms', 'android', 'gradle.properties');

    if (!fs.existsSync(configXmlPath) || !fs.existsSync(path.dirname(gradlePropsPath))) {
        return;
    }

    const configData = fs.readFileSync(configXmlPath, 'utf8');

    let password = '';
    let username = 'Jacksun84';

    // 1. Try reading from config.xml preferences
    const passMatch = configData.match(/<preference\s+name=["'](?:ANDROID_ZOOM_SDK_PASSWORD|GITHUB_TOKEN)["']\s+value=["']([^"']+)["']/i);
    if (passMatch && passMatch[1]) {
        password = passMatch[1];
    }

    const userMatch = configData.match(/<preference\s+name=["']GITHUB_USERNAME["']\s+value=["']([^"']+)["']/i);
    if (userMatch && userMatch[1]) {
        username = userMatch[1];
    }

    // 2. Fallback: Try reading from CLI cmdline variables passed by Cordova/MABS
    if (!password && context.opts && context.opts.cli_variables) {
        password = context.opts.cli_variables.ANDROID_ZOOM_SDK_PASSWORD || context.opts.cli_variables.GITHUB_TOKEN || '';
    }

    if (password) {
        console.log('✅ [Zoom Plugin] Writing GitHub authentication token to gradle.properties');
        let content = fs.existsSync(gradlePropsPath) ? fs.readFileSync(gradlePropsPath, 'utf8') : '';

        // Overwrite or append property safely
        if (content.includes('ANDROID_ZOOM_SDK_PASSWORD=')) {
            content = content.replace(/ANDROID_ZOOM_SDK_PASSWORD=.*/g, `ANDROID_ZOOM_SDK_PASSWORD=${password}`);
        } else {
            content += `\nANDROID_ZOOM_SDK_PASSWORD=${password}\n`;
        }

        if (!content.includes('GITHUB_USERNAME=')) {
            content += `GITHUB_USERNAME=${username}\n`;
        }

        fs.writeFileSync(gradlePropsPath, content, 'utf8');
    } else {
        console.log('⚠️ [Zoom Plugin] ANDROID_ZOOM_SDK_PASSWORD not found in config.xml preferences or plugin variables!');
    }
};