const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    const src = path.join(context.opts.plugin.dir, 'src', 'android', 'proguard-rules.pro');
    const dest = path.join(context.opts.projectRoot, 'platforms', 'android', 'app', 'proguard-rules.pro');
    fs.copyFileSync(src, dest);
    console.log('Copied proguard-rules.pro to ' + dest);
};