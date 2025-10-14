#!/usr/bin/env node

/**
 * Hook: removeDisableBackupPlugin.js
 * Purpose: Detect and remove "outsystems-plugin-disable-backup"
 * to prevent manifest overwrite.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Q = require('q');

module.exports = function (context) {
    console.log('🚀 [Zoom Plugin] Checking for outsystems-plugin-disable-backup...');

    const projectRoot = context.opts.projectRoot;
    const pluginsDir = path.join(projectRoot, 'plugins');
    const targetPlugin = 'outsystems-plugin-disable-backup';

    // 1️⃣ Check if the plugin folder exists
    const pluginPath = path.join(pluginsDir, targetPlugin);
    if (!fs.existsSync(pluginPath)) {
        console.log(`ℹ️ [Zoom Plugin] Plugin "${targetPlugin}" not found. Nothing to remove.`);
        return;
    }

    console.log(`⚠️ [Zoom Plugin] Plugin "${targetPlugin}" found. Removing to avoid manifest conflict...`);

    // 2️⃣ Execute cordova plugin remove command
    const deferred = Q.defer();
    const cmd = `cordova plugin remove ${targetPlugin} --verbose`;

    exec(cmd, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ [Zoom Plugin] Failed to remove ${targetPlugin}: ${stderr}`);
            deferred.reject(error);
            return;
        }

        console.log(`✅ [Zoom Plugin] Successfully removed ${targetPlugin}`);
        console.log(`🧩 [Zoom Plugin] CLI Output:\n${stdout}`);

        // Double-check that folder was removed
        if (!fs.existsSync(pluginPath)) {
            console.log('✅ [Zoom Plugin] Confirmed: plugin directory removed.');
        } else {
            console.warn('⚠️ [Zoom Plugin] Plugin directory still present, manual cleanup may be required.');
        }

        deferred.resolve();
    });

    return deferred.promise;
};