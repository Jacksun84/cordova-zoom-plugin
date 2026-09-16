const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
    const gradlePropertiesPath = path.join(platformRoot, 'gradle.properties');

    // Desugaring & Jetifier settings for Zoom SDK
    const propertiesToAppend = [
        '',
        '# Added by Zoom Plugin hook',
        'android.useAndroidX=true',
        'android.enableJetifier=true'
    ].join('\n');

    if (fs.existsSync(gradlePropertiesPath)) {
        let content = fs.readFileSync(gradlePropertiesPath, 'utf8');
        
        // Remove deprecated enableR8 lines if present
        content = content.replace(/android\.enableR8\s*=\s*true/g, '');
        content = content.replace(/android\.enableR8\.fullMode\s*=\s*false/g, '');

        if (!content.includes('android.enableJetifier')) {
            content += propertiesToAppend;
        }

        fs.writeFileSync(gradlePropertiesPath, content, 'utf8');
        console.log('Successfully cleaned and updated gradle.properties.');
    }
};