#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const et = require('elementtree');

module.exports = function (context) {
    const manifestPath = path.join(context.opts.projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
    console.log("--- ✅ --- manifestPath :: " + manifestPath);

    if (fs.existsSync(manifestPath)) {
        const manifestData = fs.readFileSync(manifestPath, 'utf-8');
        const manifestTree = et.parse(manifestData);

        let modified = false;
        const manifestRoot = manifestTree.getroot();

        // ===== Ensure xmlns:tools exists =====
        if (!manifestRoot.attrib['xmlns:tools']) {
            manifestRoot.attrib['xmlns:tools'] = "http://schemas.android.com/tools";
            modified = true;
            console.log("--- ✅ --- Added xmlns:tools attribute to <manifest>.");
        }

        // ===== Helper functions =====
        function checkAndAddToolsReplace(element, attributeValue) {
            const toolsReplace = element.attrib['tools:replace'];
            if (toolsReplace) {
                const values = toolsReplace.split(',').map(v => v.trim());
                if (!values.includes(attributeValue)) {
                    element.attrib['tools:replace'] = toolsReplace + ',' + attributeValue;
                    return true;
                }
            } else {
                element.attrib['tools:replace'] = attributeValue;
                return true;
            }
            return false;
        }

        // ===== Modify <application> tag =====
        const applications = manifestTree.findall(".//application");
        applications.forEach(application => {
            let changed = false;

            // 👇 This reproduces the OutSystems plugin behavior
            if (application.attrib['android:allowBackup'] !== 'false') {
                application.attrib['android:allowBackup'] = 'false';
                changed = true;
                console.log("--- 🩵 --- Set android:allowBackup=\"false\" (same as OutSystems disable-backup).");
            }

            // Add our networkSecurityConfig replace rule
            changed = checkAndAddToolsReplace(application, 'android:allowBackup') || changed;
            changed = checkAndAddToolsReplace(application, 'android:networkSecurityConfig') || changed;

            if (changed) {
                modified = true;
                console.log("--- ✅ --- Updated tools:replace for application.");
                console.log("--- 🔍 --- Final tools:replace value:", application.attrib['tools:replace']);
            }
        });

        // ===== Modify <provider> tag =====
        const providers = manifestTree.findall(".//provider[@android:authorities]");
        providers.forEach(provider => {
            if (provider.attrib['android:authorities'] === '${applicationId}.opener.provider') {
                modified = checkAndAddToolsReplace(provider, 'android:authorities') || modified;
            }

            if (provider.attrib['android:authorities'] === '${applicationId}.cdv.core.file.provider') {
                modified = checkAndAddToolsReplace(provider, 'android:authorities') || modified;
            }
        });

        // ===== Modify <meta-data> tag =====
        const metaDatas = manifestTree.findall(".//meta-data[@android:name]");
        metaDatas.forEach(metaData => {
            if (metaData.attrib['android:name'] === 'android.support.FILE_PROVIDER_PATHS') {
                modified = checkAndAddToolsReplace(metaData, 'android:resource') || modified;
            }
        });

        console.log("--- ✅ --- modified :: " + modified);

        if (modified) {
            const updatedManifestData = manifestTree.write({ indent: 4 });
            fs.writeFileSync(manifestPath, updatedManifestData, 'utf-8');
            console.log(' --- ✅ --- AndroidManifest.xml has been updated.');
            console.log(' --- 🧩 --- Updated AndroidManifest.xml content:\n', updatedManifestData);
        } else {
            console.log(' --- ℹ️ --- No modifications were necessary for AndroidManifest.xml.');
        }
    } else {
        console.warn('  --- ❌ --- AndroidManifest.xml not found. Make sure the Android platform is added.');
    }
};