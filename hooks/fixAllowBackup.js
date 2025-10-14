#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    console.log("🔍 [Zoom Plugin] Checking and disabling OutSystems disable-backup hook...");

    const projectRoot = context.opts.projectRoot;
    const targetHookPath = path.join(
        projectRoot,
        'plugins',
        'outsystems-plugin-disable-backup',
        'hooks',
        'disableAndroidBackup.js'
    );

    // 1️⃣ Verifica se o arquivo existe
    if (!fs.existsSync(targetHookPath)) {
        console.warn("⚠️ [Zoom Plugin] OutSystems disableAndroidBackup.js not found at path:");
        console.warn(targetHookPath);
        return;
    }

    console.log(`✅ [Zoom Plugin] Found OutSystems disableAndroidBackup.js at: ${targetHookPath}`);

    // 2️⃣ Lê o conteúdo original
    const originalContent = fs.readFileSync(targetHookPath, 'utf8');

    // 3️⃣ Verifica se já está comentado
    if (originalContent.trim().startsWith('// [Zoom Plugin Disabled Hook]')) {
        console.log("ℹ️ [Zoom Plugin] File already commented. Skipping...");
        return;
    }

    // 4️⃣ Comenta todo o conteúdo
    const commented = [
        '// [Zoom Plugin Disabled Hook]',
        '// Original OutSystems disableAndroidBackup.js content commented by Zoom plugin hook',
        ...originalContent.split('\n').map(line => '// ' + line),
        ''
    ].join('\n');

    // 5️⃣ Escreve o novo conteúdo no arquivo
    fs.writeFileSync(targetHookPath, commented, 'utf8');

    // 6️⃣ Log de confirmação
    console.log('✅ [Zoom Plugin] Successfully commented OutSystems disableAndroidBackup.js');
    console.log('🧩 [Zoom Plugin] File preview:\n');
    console.log(commented.split('\n').slice(0, 8).join('\n') + '\n... (truncated)');
};