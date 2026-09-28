const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    const rootdir = context.opts.projectRoot;

    // Purge temporary platform build cache before Gradle evaluates dependencies
    const androidBuildDir = path.join(rootdir, 'platforms', 'android', 'app', 'build');
    if (fs.existsSync(androidBuildDir)) {
        console.log('🧹 [Zoom Plugin] Cleaning old Android build directory...');
        try {
            fs.rmSync(androidBuildDir, { recursive: true, force: true });
        } catch (e) {
            console.log('⚠️ [Zoom Plugin] Could not delete build folder:', e.message);
        }
    }
    
    const configXmlPath = path.join(rootdir, 'config.xml');
    const gradlePropsPath = path.join(rootdir, 'platforms', 'android', 'gradle.properties');

    let password = '';
    let username = 'Jacksun84';

    // 1. Check config.xml
    if (fs.existsSync(configXmlPath)) {
        const configData = fs.readFileSync(configXmlPath, 'utf8');
        const passMatch = configData.match(/<preference\s+name=["'](?:ANDROID_ZOOM_SDK_PASSWORD|GITHUB_TOKEN)["']\s+value=["']([^"']+)["']/i);
        if (passMatch && passMatch[1] && !passMatch[1].startsWith('$')) {
            password = passMatch[1];
        }
    }

    // 2. Check plugins/fetch.json (where Cordova stores plugin install variables)
    if (!password) {
        const fetchJsonPath = path.join(rootdir, 'plugins', 'fetch.json');
        if (fs.existsSync(fetchJsonPath)) {
            try {
                const fetchJson = JSON.parse(fs.readFileSync(fetchJsonPath, 'utf8'));
                for (const pluginKey in fetchJson) {
                    const vars = fetchJson[pluginKey].variables;
                    if (vars && (vars.ANDROID_ZOOM_SDK_PASSWORD || vars.GITHUB_TOKEN)) {
                        password = vars.ANDROID_ZOOM_SDK_PASSWORD || vars.GITHUB_TOKEN;
                        break;
                    }
                }
            } catch (e) {
                console.log('⚠️ [Zoom Plugin] Error reading fetch.json:', e.message);
            }
        }
    }

    // 3. Check platforms/android/android.json
    if (!password) {
        const androidJsonPath = path.join(rootdir, 'platforms', 'android', 'android.json');
        if (fs.existsSync(androidJsonPath)) {
            try {
                const androidJson = JSON.parse(fs.readFileSync(androidJsonPath, 'utf8'));
                if (androidJson.installed_plugins) {
                    const zoomPlugin = androidJson.installed_plugins['cordova.plugin.zoom'];
                    if (zoomPlugin) {
                        password = zoomPlugin.ANDROID_ZOOM_SDK_PASSWORD || zoomPlugin.GITHUB_TOKEN;
                    }
                }
            } catch (e) {
                console.log('⚠️ [Zoom Plugin] Error reading android.json:', e.message);
            }
        }
    }

    // 4. Check context.opts.cli_variables or process.env
    if (!password && context.opts && context.opts.cli_variables) {
        password = context.opts.cli_variables.ANDROID_ZOOM_SDK_PASSWORD || context.opts.cli_variables.GITHUB_TOKEN;
    }
    if (!password) {
        password = process.env.ANDROID_ZOOM_SDK_PASSWORD || process.env.GITHUB_TOKEN;
    }

    // Write to gradle.properties if password was resolved
    if (password) {
        console.log('✅ [Zoom Plugin] Found ANDROID_ZOOM_SDK_PASSWORD! Injecting into gradle.properties...');
        if (fs.existsSync(path.dirname(gradlePropsPath))) {
            let content = fs.existsSync(gradlePropsPath) ? fs.readFileSync(gradlePropsPath, 'utf8') : '';

            if (content.includes('ANDROID_ZOOM_SDK_PASSWORD=')) {
                content = content.replace(/ANDROID_ZOOM_SDK_PASSWORD=.*/g, `ANDROID_ZOOM_SDK_PASSWORD=${password}`);
            } else {
                content += `\nANDROID_ZOOM_SDK_PASSWORD=${password}\n`;
            }

            if (!content.includes('GITHUB_USERNAME=')) {
                content += `GITHUB_USERNAME=${username}\n`;
            }

            fs.writeFileSync(gradlePropsPath, content, 'utf8');
            console.log('✅ [Zoom Plugin] Successfully updated gradle.properties');
        }
    } else {
        console.log('⚠️ [Zoom Plugin] ANDROID_ZOOM_SDK_PASSWORD not found in config.xml, fetch.json, or environment!');
    }
};