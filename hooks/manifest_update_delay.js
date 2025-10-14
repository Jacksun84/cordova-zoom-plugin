module.exports = function(context) {
    const exec = require('child_process').exec;
    const path = require('path');

    // Get the project root
    const projectRoot = context.opts.projectRoot;

    // Build the correct path to the script (adjust the path as necessary)
    const scriptPath = path.join(projectRoot, 'plugins/cordova.plugin.zoom/hooks/zzzz_add_networkSecurityConfig_manifest.js');

    // Function to be executed with a delay
    function delayedExecution() {
        console.log("Executing delayed action after 5 seconds");

        // Your logic here
        exec('node plugins/cordova.plugin.zoom/hooks/zzzz_add_networkSecurityConfig_manifest.js', (err, stdout, stderr) => {
            if (err) {
                console.error("Error executing delayed script:", err);
                return;
            }
            console.log("Zoom plugin script executed successfully.");
        });
    }

    // Delay the execution by 5 seconds (5000 ms)
    console.log("Waiting for 5 seconds before executing delayed task...");
    setTimeout(delayedExecution, 5000); // Change 5000 to the delay you need in ms

    /*
    return Q.delay(5000)  // Delay for 5 seconds using Q library
        .then(delayedExecution)  // Execute the delayed function after the delay
        .catch((err) => {
            console.error("Error during delayed execution:", err);
        });
    */
};