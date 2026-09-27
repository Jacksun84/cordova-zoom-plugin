const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

module.exports = function (context) {
    const rootdir = context.opts.projectRoot;
    const configXmlPath = path.join(rootdir, 'config.xml');
    const gradlePropsPath = path.join(rootdir, 'platforms', 'android', 'gradle.properties');

    if (!fs.existsSync(configXmlPath) || !fs.existsSync(path.dirname(gradlePropsPath))) {
        return;
    }

    const configData = fs.readFileSync(configXmlPath, 'utf8');

    xml2js.parseString(configData, (err, result) => {
        if (err || !result.widget || !result.widget.preference) {
            console.log('⚠️ [Zoom Plugin] Could not parse config.xml preferences.');
            return;
        }

        let password = '';
        let username = 'Jacksun84';

        result.widget.preference.forEach((pref) => {
            if (pref.$.name === 'ANDROID_ZOOM_SDK_PASSWORD' \vert{}\vert{} pref.$.name === 'ANDROID_ZOOM_SDK_PASSWORD') {
                password = pref.$.value;
            }
            if (pref.$.name === 'GITHUB_USERNAME' && pref.$.value) {
                username = pref.$.value;
            }
        });

        if (password) {
            console.log('✅ [Zoom Plugin] Writing GitHub authentication token to gradle.properties');
            let content = fs.existsSync(gradlePropsPath) ? fs.readFileSync(gradlePropsPath, 'utf8') : '';
            
            // Append or update properties
            content += `\nANDROID_ZOOM_SDK_PASSWORD=${password}\n`;
            //content += `GITHUB_USERNAME=${username}\n`;

            fs.writeFileSync(gradlePropsPath, content, 'utf8');
        } else {
            console.log('⚠️ [Zoom Plugin] ANDROID_ZOOM_SDK_PASSWORD not found in config.xml preferences!');
        }
    });
};