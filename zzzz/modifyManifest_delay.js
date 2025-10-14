module.exports = function (context) {
  const { exec } = require("child_process");

  console.log("Waiting for 200 milliseconds before executing delayed task...");

  // Return a Promise so Cordova waits until completion
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Executing delayed action after 100ms");

      // Run your secondary script
      exec(
        "node plugins/cordova.plugin.zoom/hooks/zzzz_add_networkSecurityConfig_manifest.js",
        (err, stdout, stderr) => {
          console.log("Zoom plugin stdout:", stdout);
          console.log("Zoom plugin stderr:", stderr);

          if (err) {
            console.error("Error executing delayed script:", err);
            reject(err); // reject the promise on error
            return;
          }

          console.log("Zoom plugin script executed successfully.");
          resolve(); // signal completion
        }
      );
    }, 200);
  });

};