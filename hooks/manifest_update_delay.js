module.exports = function(context) {
    const exec = require('child_process').exec;

    // Function to be executed with a delay
    function delayedExecution() {
        console.log("Executing delayed action after 5 seconds");

        // Your logic here
        exec('node hooks/zzzz_add_networkSecurityConfig_manifest.js', (err, stdout, stderr) => {
            if (err) {
                console.error("Error executing delayed script:", err);
                return;
            }
            console.log("Zoom plugin script executed successfully.");
        });
    }

    // Delay the execution by 5 seconds (5000 ms)
    setTimeout(delayedExecution, 5000); // Change 5000 to the delay you need in ms
};