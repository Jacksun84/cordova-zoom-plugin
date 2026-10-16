const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { execSync } = require('child_process');

const SDK_VERSION = '7.2.1.39202';
//const ZIP_URL = `https://github.com/YOUR_ORG/YOUR_REPO/releases/download/ios-sdk-${SDK_VERSION}/zoom-sdk-ios-${SDK_VERSION}.zip`;

const ZIP_URL = `https://github.com/Jacksun84/cordova-zoom-plugin/releases/tag/ios-sdk-${SDK_VERSION}-16102026/zoom-sdk-ios-${SDK_VERSION}.zip`;

const EXPECTED_SHA256 = 'e0eddb3283422300ff9ef1d48790599a639606f3dd8b74c9fa89b234a21fa018'; // Replace with step 1 hash

const TARGET_DIR = path.join(__dirname, '../libs/ios');
const ZIP_PATH = path.join(__dirname, `../zoom-sdk-ios-${SDK_VERSION}.zip`);

console.log('[ZoomSDK] starting download of iOS SDK...');
module.exports = function(context) {
  if (fs.existsSync(path.join(TARGET_DIR, 'MobileRTC.xcframework'))) {
    console.log('[ZoomSDK] MobileRTC.xcframework already present in libs/ios. Skipping download.')
    return;
  }

  console.log(`[ZoomSDK] Downloading Zoom iOS SDK v${SDK_VERSION}...`);
  
  // Download script execution
  execSync(`curl -L -o "${ZIP_PATH}" "${ZIP_URL}"`);

  // SHA-256 Verification
  const fileBuffer = fs.readFileSync(ZIP_PATH);
  const hashSum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  if (hashSum.toLowerCase() !== EXPECTED_SHA256.toLowerCase()) {
    fs.unlinkSync(ZIP_PATH);
    throw new Error(`[ZoomSDK] SHA256 mismatch! Expected ${EXPECTED_SHA256}, got ${hashSum}`);
  }

  console.log('[ZoomSDK] Checksum verified. Unzipping SDK into libs/ios...');

  // Extract directly into libs/ios directory
  // Note: If your ZIP contains a 'lib/' root folder, extract to root and rename, 
  // or adjust the destination path accordingly.    
  execSync(`unzip -o "${ZIP_PATH}" -d "${path.join(__dirname, '../libs/ios')}"`);
  fs.unlinkSync(ZIP_PATH);
  console.log('[ZoomSDK] SDK extraction to libs/ios complete.');
};