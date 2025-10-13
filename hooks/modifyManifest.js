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

        function checkAndAddToolsRemove(element, attributeValue) {
            const toolsRemove = element.attrib['tools:remove'];
            if (toolsRemove) {
                const values = toolsRemove.split(',').map(v => v.trim());
                if (!values.includes(attributeValue)) {
                    element.attrib['tools:remove'] = toolsRemove + ',' + attributeValue;
                    return true;
                }
            } else {
                element.attrib['tools:remove'] = attributeValue;
                return true;
            }
            return false;
        }

        function checkAndAddToolsNode(element, attributeValue) {
            const toolsNode = element.attrib['tools:node'];
            if (toolsNode) {
                const values = toolsNode.split(',').map(v => v.trim());
                if (!values.includes(attributeValue)) {
                    element.attrib['tools:node'] = toolsNode + ',' + attributeValue;
                    return true;
                }
            } else {
                element.attrib['tools:node'] = attributeValue;
                return true;
            }
            return false;
        }

        // ===== Modify <application> tag =====
        const applications = manifestTree.findall(".//application");
        applications.forEach(application => {
            let changed = false;
            changed = checkAndAddToolsReplace(application, 'android:allowBackup') || changed;
            changed = checkAndAddToolsReplace(application, 'android:networkSecurityConfig') || changed;

            if (changed) {
                modified = true;
                console.log("--- ✅ --- Added android:allowBackup, android:networkSecurityConfig to tools:replace");
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
