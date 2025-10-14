module.exports = function (context) {
  const { exec } = require("child_process");
  const path = require("path");

  console.log("[Zoom Plugin] Waiting 200ms before final manifest adjustment...");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projectRoot = context.opts.projectRoot;
      const scriptPath = path.join(
        projectRoot,
        "plugins/cordova.plugin.zoom/zzzz/zzzz_add_networkSecurityConfig_manifest.js"
      );

      console.log("[Zoom Plugin] Executing:", scriptPath);

      exec(`node "${scriptPath}"`, (err, stdout, stderr) => {
        console.log("[Zoom Plugin] stdout:", stdout);
        console.log("[Zoom Plugin] stderr:", stderr);

        if (err) {
          console.error("[Zoom Plugin] Error executing script:", err);
          return reject(err);
        }

        console.log("[Zoom Plugin] Manifest update complete.");
        resolve();
      });
    }, 200);
  });
};