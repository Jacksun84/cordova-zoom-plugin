#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const et = require('elementtree');

module.exports = function (context) {
    const manifestPath = path.join(context.opts.projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
    console.log("--- ✅ [Zoom Plugin] --- manifestPath ::" + manifestPath);

    if (fs.existsSync(manifestPath)) {
        const manifestData = fs.readFileSync(manifestPath, 'utf-8');
        const manifestTree = et.parse(manifestData);

        let modified = false;

        const manifestRoot = manifestTree.getroot();

        if (!manifestRoot.attrib['xmlns:tools']) {
            manifestRoot.attrib['xmlns:tools'] = "http://schemas.android.com/tools";
            modified = true;
            console.log("--- ✅ [Zoom Plugin] --- Added xmlns:tools attribute to <manifest>.");
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

        // Modify <application> tag
        const applications = manifestTree.findall(".//application[@android:networkSecurityConfig]");
        applications.forEach(application => {
            console.log("--- ✅ [Zoom Plugin] -- application ::" + application.attrib);
            if (application.attrib['android:networkSecurityConfig'] === '@xml/network_security_config') {
                modified = checkAndAddToolsReplace(application, 'android:networkSecurityConfig') || modified;
            }
        });
        
        console.log("--- ✅ [Zoom Plugin] --- modified ::" + modified);

        if (modified) {
            // Write back to AndroidManifest.xml
            const updatedManifestData = manifestTree.write({ indent: 4 });
            fs.writeFileSync(manifestPath, updatedManifestData, 'utf-8');
            console.log(' --- ✅ [Zoom Plugin] --- AndroidManifest.xml has been updated.');
            console.log(' --- ✅ [Zoom Plugin] --- Updated AndroidManifest.xml content:\n', updatedManifestData);
        } else {
            console.log(' --- ✅ [Zoom Plugin] --- No modifications were necessary for AndroidManifest.xml.');
        }
    } else {
        console.warn('  --- ❌ [Zoom Plugin] --- AndroidManifest.xml not found. Make sure the Android platform is added.');
    }
};
