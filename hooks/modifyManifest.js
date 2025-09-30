#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const et = require('elementtree');

module.exports = function (context) {
    const manifestPath = path.join(context.opts.projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
    console.log("--- ✅ --- manifestPath ::" + manifestPath);

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

        // Function to check if attribute already exists in tools:replace
        function checkAndAddToolsReplace(element, attributeValue) {
            const toolsReplace = element.attrib['tools:replace'];
            if (toolsReplace) {
                if (!toolsReplace.split(',').includes(attributeValue)) {
                    element.attrib['tools:replace'] = toolsReplace + ',' + attributeValue;
                    return true;
                }
            } else {
                element.attrib['tools:replace'] = attributeValue;
                return true;
            }
            return false;
        }

        // Function to check if attribute already exists in tools:node
        /*
        function checkAndAddToolsNode(element, attributeValue) {
            const toolsNode = element.attrib['tools:node'];
            if (toolsNode) {
                if (!toolsNode.split(',').includes(attributeValue)) {
                    element.attrib['tools:node'] = toolsNode + ',' + attributeValue;
                    return true;
                }
            } else {
                element.attrib['tools:node'] = attributeValue;
                return true;
            }
            return false;
        }
        */

        // Modify <application> tag        
        const applications = manifestTree.findall(".//application[@android:networkSecurityConfig]");
        applications.forEach(application => {
            if (application.attrib['android:networkSecurityConfig'] === '@xml/network_security_config') {
                modified = checkAndAddToolsReplace(application, 'android:networkSecurityConfig') || modified;
                //modified = checkAndAddToolsNode(application, 'replace') || modified; This was the suggestion, but it doesn't work
            }
        });
        

        // Modify <provider> tag
        const providers = manifestTree.findall(".//provider[@android:authorities]");
        providers.forEach(provider => {
            if (provider.attrib['android:authorities'] === '${applicationId}.opener.provider') {
                modified = checkAndAddToolsReplace(provider, 'android:authorities') || modified;
            }

            if (provider.attrib['android:authorities'] === '${applicationId}.cdv.core.file.provider') {
                modified = checkAndAddToolsReplace(provider, 'android:authorities') || modified;
            }
        });

        // Modify <meta-data> tag
        const metaDatas = manifestTree.findall(".//meta-data[@android:name]");
        metaDatas.forEach(metaData => {
            if (metaData.attrib['android:name'] === 'android.support.FILE_PROVIDER_PATHS') {
                modified = checkAndAddToolsReplace(metaData, 'android:resource') || modified;
            }
        });

        console.log("--- ✅ --- modified ::" + modified);

        if (modified) {
            // Write back to AndroidManifest.xml
            const updatedManifestData = manifestTree.write({ indent: 4 });
            fs.writeFileSync(manifestPath, updatedManifestData, 'utf-8');
            console.log(' --- ✅ --- AndroidManifest.xml has been updated.');
            console.log(' --- ✅ --- Updated AndroidManifest.xml content:\n', updatedManifestData);
        } else {
            console.log(' --- ✅ --- No modifications were necessary for AndroidManifest.xml.');
        }
    } else {
        console.warn('  --- ❌ --- AndroidManifest.xml not found. Make sure the Android platform is added.');
    }
};
