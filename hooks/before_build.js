module.exports = function (context) {
    const fs = require('fs');
    const path = require('path');

    const projectRoot = context.opts.projectRoot;
    const gradlePropsPath = path.join(projectRoot, 'platforms', 'android', 'gradle.properties');

    if (!fs.existsSync(gradlePropsPath)) {
        return;
    }

    let password = process.env.ANDROID_ZOOM_SDK_PASSWORD;

    // Fallback: Read from fetch.json (populated by OutSystems variables)
    if (!password) {
        const fetchJsonPath = path.join(projectRoot, 'plugins', 'fetch.json');
        if (fs.existsSync(fetchJsonPath)) {
            try {
                const fetchJson = JSON.parse(fs.readFileSync(fetchJsonPath, 'utf-8'));
                const pluginInfo = fetchJson['cordova.plugin.zoom'];
                if (pluginInfo && pluginInfo.variables) {
                    password = pluginInfo.variables.ANDROID_ZOOM_SDK_PASSWORD;
                }
            } catch (e) {
                console.error('Error parsing fetch.json:', e);
            }
        }
    }

    if (password) {
        let propsContent = fs.readFileSync(gradlePropsPath, 'utf-8');
        if (!propsContent.includes('ANDROID_ZOOM_SDK_PASSWORD=')) {
            propsContent += `\nANDROID_ZOOM_SDK_PASSWORD=${password}\n`;
            fs.writeFileSync(gradlePropsPath, propsContent, 'utf-8');
            console.log('✅ Exported ANDROID_ZOOM_SDK_PASSWORD to platforms/android/gradle.properties');
        }
    } else {
        console.warn('⚠️ ANDROID_ZOOM_SDK_PASSWORD was not provided via environment or plugin variables.');
    }
};