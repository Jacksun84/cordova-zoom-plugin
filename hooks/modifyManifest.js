#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const et = require('elementtree');

module.exports = function (context) {
    const manifestPath = path.join(
        context.opts.projectRoot,
        'platforms',
        'android',
        'app',
        'src',
        'main',
        'AndroidManifest.xml'
    );

    console.log("[Zoom Plugin] 📄 Manifest path:", manifestPath);

    if (!fs.existsSync(manifestPath)) {
        console.warn("[Zoom Plugin] ⚠️ AndroidManifest.xml not found!");
        return;
    }

    const manifestData = fs.readFileSync(manifestPath, 'utf-8');
    const manifestTree = et.parse(manifestData);
    const manifestRoot = manifestTree.getroot();

    let modified = false;

    // ✅ Garantir xmlns:tools
    if (!manifestRoot.attrib['xmlns:tools']) {
        manifestRoot.attrib['xmlns:tools'] = "http://schemas.android.com/tools";
        console.log("[Zoom Plugin] ✅ Added xmlns:tools to <manifest>");
        modified = true;
    }

    // ✅ Pega a tag <application>
    const application = manifestTree.find(".//application");
    if (application) {
        const toolsReplace = application.attrib['tools:replace'];

        if (toolsReplace) {
            // Já existe tools:replace → adicionar android:networkSecurityConfig se faltar
            if (!toolsReplace.includes('android:networkSecurityConfig')) {
                application.attrib['tools:replace'] = toolsReplace + ',android:networkSecurityConfig';
                console.log("[Zoom Plugin] 🔧 Added android:networkSecurityConfig to existing tools:replace");
                modified = true;
            }
        } else {
            // Não existe tools:replace → cria com os dois
            application.attrib['tools:replace'] = 'android:allowBackup,android:networkSecurityConfig';
            console.log("[Zoom Plugin] ✅ Created tools:replace with allowBackup + networkSecurityConfig");
            modified = true;
        }
    } else {
        console.warn("[Zoom Plugin] ⚠️ <application> tag not found in AndroidManifest.xml");
    }

    // ✅ Salva arquivo atualizado
    if (modified) {
        const updatedData = manifestTree.write({ indent: 4 });
        fs.writeFileSync(manifestPath, updatedData, 'utf-8');
        console.log("[Zoom Plugin] ✅ AndroidManifest.xml updated successfully.");
        console.log(updatedData);
    } else {
        console.log("[Zoom Plugin] ℹ️ No modifications needed in AndroidManifest.xml.");
    }
};
