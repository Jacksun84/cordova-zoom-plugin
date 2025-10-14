#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const et = require('elementtree');

module.exports = function (context) {
    console.log("🔍 [Zoom Plugin] Checking if OutSystems disable-backup hook already ran...");

    const manifestPath = path.join(
        context.opts.projectRoot,
        'platforms',
        'android',
        'app',
        'src',
        'main',
        'AndroidManifest.xml'
    );

    if (!fs.existsSync(manifestPath)) {
        console.warn("⚠️ [Zoom Plugin] Manifest not found — skipping check.");
        return;
    }

    const manifestData = fs.readFileSync(manifestPath, 'utf8');
    const hasDisableBackup = manifestData.includes('android:allowBackup="false"');

    if (hasDisableBackup) {
        console.log("✅ [Zoom Plugin] OutSystems disable-backup hook already executed.");
    } else {
        console.log("⚠️ [Zoom Plugin] OutSystems hook has NOT executed yet — waiting is recommended.");
    }

    // 👉 Continue your patch logic here
    const manifestTree = et.parse(manifestData);
    const application = manifestTree.find('.//application');
    if (application) {
        application.set('android:allowBackup', 'false');
        const currentReplace = application.get('tools:replace') || '';
        const values = currentReplace.split(',').map(v => v.trim()).filter(v => v);
        ['android:allowBackup', 'android:networkSecurityConfig'].forEach(v => {
            if (!values.includes(v)) values.push(v);
        });
        application.set('tools:replace', values.join(','));
        fs.writeFileSync(manifestPath, manifestTree.write({ indent: 4 }), 'utf8');
        console.log("✅ [Zoom Plugin] Manifest values successfully restored after OutSystems hook.");
    }
};