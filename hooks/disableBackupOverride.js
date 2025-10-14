#!/usr/bin/env node

module.exports = function (context) {
    console.log("🩵 ---- [Zoom Plugin] Overriding OutSystems Disable Backup Hook...");
    console.log("✅ ---- [Zoom Plugin] android:allowBackup will be handled by our plugin.");
};