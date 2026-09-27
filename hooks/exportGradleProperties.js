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

    // Extract preference values using regex without requiring xml2js
    let password = '';
    let username = 'Jacksun84';

    const passMatch = configData.match(/<preference\s+name=["'](?:ANDROID_ZOOM_SDK_PASSWORD|GITHUB_TOKEN)["']\s+value=["']([^"']+)["']/i);
    if (passMatch && passMatch[1]) {
        password = passMatch[1];
    }

    const userMatch = configData.match(/<preference\s+name=["']GITHUB_USERNAME["']\s+value=["']([^"']+)["']/i);
    if (userMatch && userMatch[1]) {
        username = userMatch[1];
    }

    if (password) {
        console.log('✅ [Zoom Plugin] Writing GitHub authentication token to gradle.properties');
        let content = fs.existsSync(gradlePropsPath) ? fs.readFileSync(gradlePropsPath, 'utf8') : '';

        // Prevent duplicate entries on consecutive builds
        if (!content.includes('ANDROID_ZOOM_SDK_PASSWORD=')) {
            content += `\nANDROID_ZOOM_SDK_PASSWORD=${password}\n`;
            //content += `GITHUB_USERNAME=${username}\n`;
            fs.writeFileSync(gradlePropsPath, content, 'utf8');
        }
    } else {
        console.log('⚠️ [Zoom Plugin] ANDROID_ZOOM_SDK_PASSWORD not found in config.xml preferences!');
    }
};