const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
    const gradlePropertiesPath = path.join(platformRoot, 'gradle.properties');

    // Desugaring & D8 settings needed for modern Zoom SDK
    const propertiesToAppend = [
        '',
        '# Custom settings added by Zoom Plugin hook',
        'android.enableR8=true',
        'android.enableR8.fullMode=false'
    ].join('\n');

    if (fs.existsSync(gradlePropertiesPath)) {
        let content = fs.readFileSync(gradlePropertiesPath, 'utf8');

        console.log(' --- ✅ --- Gradle properties path: ', gradlePropertiesPath);
        console.log(' --- 🔍 --- Gradle properties:\n', content);
        
        // Prevent duplicate appending
        /*if (!content.includes('android.enableR8.fullMode')) {
            fs.appendFileSync(gradlePropertiesPath, propertiesToAppend, 'utf8');
            console.log('--- 🧩 --- Successfully updated gradle.properties for MABS build with: .',propertiesToAppend);
        }*/
    } else {
        console.warn('gradle.properties not found at: ' + gradlePropertiesPath);
    }
};