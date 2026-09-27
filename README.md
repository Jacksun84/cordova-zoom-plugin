# Zoom Outsystems Software Development Kit (SDK)

<div align="center">
<img src="https://s3.amazonaws.com/user-content.stoplight.io/8987/1541013063688" width="400px" max-height="400px" style="margin:auto;"/>
</div>

## Table of Contents
- [:rotating_light: Announcement :rotating_light:](#rotating_light-announcement-rotating_light)   
- [Prerequisites](#prerequisites)   
- [Installing](#installing)   
- [Usage](#usage)   
- [License](#license)


## :rotating_light: Announcement :rotating_light:
To align with Zoom’s [recent announcement](https://blog.zoom.us/wordpress/2020/04/22/zoom-hits-milestone-on-90-day-security-plan-releases-zoom-5-0/) pertaining to our security initiative, Zoom Client SDKs have added **AES 256-bit GCM encryption** support, which provides more protection for meeting data and greater resistance to tampering. **The system-wide account enablement of AES 256-bit GCM encryption will take place on June 01, 2020.** You are **strongly recommended** to start the required upgrade to this latest version 4.6.21666.0512 at your earliest convenience. Please note that any Client SDK versions below 4.6.21666.0512 will **no longer be operational** from June 01.

> If you would like to test the latest SDK with AES 256-bit GCM encryption meeting before 05/30, you may:
> 1. Download the latest version of Zoom client: https://zoom.us/download
> 2. Visit https://zoom.us/testgcm and launch a GCM enabled meeting with your Zoom client, you will see a Green Shield icon that indicates the GCM encryption is enabled
> 3. Use SDK to join this meeting

## Prerequisites

Before you try out our SDK, you would need the following to get started:

* **A Zoom Account**: If you do not have one, you can sign up at [https://zoom.us/signup](https://zoom.us/signup).
  * Once you have your Zoom Account, sign up for a 60-days free trial at [https://marketplace.zoom.us/](https://marketplace.zoom.us/)
* **A mobile device**
  * Android
    * Android 5.0 (API Level 21) or later.
    * CPU: armeabi-v7a, x86, armeabi, arm64-v8a, x86_64
    * **compileSdkVersion**: 29+
    * **buildToolsVersion**: 29+
    * **minSdkVersion**: 21
    * **Required dependencies**
    ```
    implementation 'androidx.multidex:multidex:2.0.0'
    implementation 'androidx.recyclerview:recyclerview:1.0.0'
    implementation 'androidx.appcompat:appcompat:1.0.0'
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
    implementation 'com.google.android.material:material:1.0.0-rc01'
    ```
  * iOS
    * iPhone or iPad
    * **npm@6.7.0+**
    * **cordova-cli@7.1.0+**
    

  
 If you are developing on Android, you will need to install the 8.0.0 version of cordova-android
 ```
 cordova platform add android@8.0.0
 ```
  If you are developing on iOS, you will need to install the 5.1.0 version of cordova-ios
 ```
 cordova platform add ios@5.1.0
 ```

## Last Updates/Improvements
- Added new method to know if the Zoom SDK as already initialized or not
- Removed unecessary android permissions (USE_FULL_SCREEN_INTENT, READ_MEDIA_IMAGES,READ_MEDIA_VIDEO) to be compatible with last google policies.
- Update cordova-androidx-build url from https://github.com/Pushwoosh/cordova-androidx-build.git to https://github.com/Pushwoosh/cordova-androidx-build.git#1.1-OS to be compatible with the same dependencies from https://github.com/Pushwoosh/pushwoosh-phonegap-plugin.git#8.3.27-OS (https://www.outsystems.com/forge/component-overview/1556/pushwoosh-plugin-o11).
- Gradle file (src/android/build-android.gradle) updated/reornanized with the correct versions of dependencies according to the zoom sdk samples.
- Added necessary androidx dependencies to src/android/build-android.gradle file to fix runtime craches when changing the background image/effects.
- Change javascript method setLanguage to setLocale to avoid OS errors (setLanguage is not a function).
## Installing
Local:
  Clone or download a copy of our SDK files from GitHub. After you unzipped the file, you should have the following folders:

  ```
  .
  ├── README.md
  ├── libs
  ├── package.json
  ├── plugin.xml
  ├── src
  └── www
  ```
  In your cordova application directory, run the following to install the plugin:
  ```
  cordova plugin add cordova.plugin.zoom --variable IOS_CAMERA_USAGE_DESCRIPTION="Usage description" --variable IOS_MICROPHONE_USAGE_DESCRIPTION="Usage description"
  ```
Outsystems:
  In the extensibility configurations of the plugin wrapper put:
  {
    ,
    variables:[{"key":"IOS_CAMERA_USAGE_DESCRIPTION","value":"Usage description"},{"key":"IOS_MICROPHONE_USAGE_DESCRIPTION","value":"Usage description"}]
  }

## Usage

1. Initialize Zoom SDK
Initialize Zoom SDK, need to be called when app fired up.
```
this.zoomService.initialize(SDK_KEY,SDK_SECRET,API_KEY, API_SECRET)
  .then((success: any) => console.log(success))
  .catch((error: any) => console.log(error));
```

2. Login
Log user in with Zoom username and password.
```
this.zoomService.login(userName, password)
  .then((success: any) => console.log(success))
  .catch((error: any) => console.log(error));
```
3. Logout
Log user out.
```
this.zoomService.logout()
  .then((success: boolean) => console.log(success))
  .catch((error: any) => console.log(error));
```

4. isLoggedIn
Check whether a user is logged in. Return true if the user is logged in. False if the user is not logged in.
```
this.zoomService.isLoggedIn()
  .then((success: boolean) => console.log(success))
  .catch((error: any) => console.log(error));
```

5. MeetingOptions
Meeting options. Configure the default meeting room. Some of the options are only available on Android.
```
let options = {
  custom_meeting_id: "Customized Title",
  no_share: false,
  no_audio: false,
  no_video: false,
  no_driving_mode: true,
  no_invite: true,
  no_meeting_end_message: true,
  no_dial_in_via_phone: false,
  no_dial_out_to_phone: false,
  no_disconnect_audio: true,
  no_meeting_error_message: true,
  no_unmute_confirm_dialog: true,    // Android only
  no_webinar_register_dialog: false, // Android only
  no_titlebar: false,
  no_bottom_toolbar: false,
  no_button_video: false,
  no_button_audio: false,
  no_button_share: false,
  no_button_participants: false,
  no_button_more: false,
  no_text_password: true,
  no_text_meeting_id: false,
  no_button_leave: false
 };
 ```

6. Join Meeting
Join meeting 
```
this.zoomService.joinMeeting(meetingNumber, meetingPassword, displayName, options)
  .then((success: any) => console.log(success))
  .catch((error: any) => console.log(error));
```
7. Get Users Id
Get Users Id
```
this.zoomService.getUsersId()
  .then((success: [UserId]) => console.log(success))
  .catch((error: any) => console.log(error));
```

8. Start an existing meeting for non-login user
Start an existing meeting for non-login user.
```
this.zoomService.startMeetingWithZAK(meetingNumber, displayName, userId, options)
  .then((success: any) => console.log(success))
  .catch((error: any) => console.log(error));
```

9. Start an existing meeting for logged in user
Start an existing meeting for logged in user.
```
this.zoomService.startMeeting(meetingNumber, options)
  .then((success: any) => console.log(success))
  .catch((error: any) => console.log(error));
```

10. Start an instant meeting for logged in user
Start an instant meeting for logged in user.
```
this.zoomService.startInstantMeeting()
  .then((success: any) => console.log(success))
  .catch((error: any) => console.log(error));
```

## License

Please refer to [LICENSE.md](LICENSE.md) file for details

---
Copyright ©2020 Zoom Video Communications, Inc. All rights reserved.








cordova plugin add ../cordova-zoom-plugin --variable GITHUB_TOKEN="token" --variable ANDROID-MINSDKVERSION="28" --variable ANDROID-TARGETSDKVERSION="36" --variable GITHUB_USERNAME="Jacksun84"

set GITHUB_TOKEN="token" ANDROID-MINSDKVERSION="28" ANDROID-TARGETSDKVERSION="36" GITHUB_USERNAME="Jacksun84"


# 7.2. Explicitly remove cached plugin & platform
cordova plugin remove cordova-zoom-plugin
cordova platform remove android

# 7.3. Re-add the plugin (this forces Cordova to copy the updated plugin files)
cordova plugin add ../cordova-plugin-zoom-meeting

# 7.4. Re-add the android platform
cordova platform add android@15.0.0

# 7.5. Copy mobilertc.aar into the platform libs directory
mkdir -p platforms/android/app/libs
cp ../cordova-plugin-zoom-meeting/libs/mobilertc.aar platforms/android/app/libs/

# 7.6. Apply mandatory Gradle properties (overriding default Xmx2048m with 4096m)
cat <<EOT > platforms/android/gradle.properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
android.useAndroidX=true
android.enableJetifier=true
android.useFullClasspathForDexingTransform=true


```bash
# 1. Create the test app
cordova create CordovaTestApp com.example.zoomtest ZoomTestApp
cd CordovaTestApp

# 2.2 Add the gradle.properties file for CordovaTestAPP
# Mandatory settings for building Zoom SDK (mobilertc.aar) with Cordova
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
android.useAndroidX=true
android.enableJetifier=true
android.useFullClasspathForDexingTransform=true

# 1.3 Add properties to CordovaTestAPP->config.xml
  <preference name="android-minSdkVersion" value="28" />
  <preference name="android-targetSdkVersion" value="36" />

  <plugin name="cordova-zoom-plugin" spec="../cordova-zoom-plugin">
      <variable name="ANDROID-MINSDKVERSION" value="24" />
      <variable name="ANDROID-TARGETSDKVERSION" value="36" />
  </plugin>

# 1.4 Add the node tools to config.xml (cordova test app)
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.example.zoomtest" 
    version="1.0.0" 
    xmlns="http://www.w3.org/ns/widgets" 
    xmlns:cdv="http://cordova.apache.org/ns/1.0"
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <name>ZoomTestApp</name>
    <description>
        A sample Apache Cordova application that responds to the deviceready event.
    </description>
    <author email="dev@cordova.apache.org" href="https://cordova.apache.org">
        Apache Cordova Team
    </author>
    <content src="index.html" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />

    <preference name="android-minSdkVersion" value="28" />
    <preference name="android-targetSdkVersion" value="36" />

    <!--
    <plugin name="cordova-zoom-plugin" spec="../cordova-zoom-plugin">
        <variable name="ANDROID-MINSDKVERSION" value="24" />
        <variable name="ANDROID-TARGETSDKVERSION" value="36" />
    </plugin>
    -->

</widget>

# 2. Add Android platform
cordova platform add android@15.0.0

# 3. Add the local plugin
cordova plugin add ../cordova-zoom-plugin
cordova plugin add ../cordova-zoom-plugin --variable GITHUB_TOKEN="token" --variable ANDROID-MINSDKVERSION="28" --variable ANDROID-TARGETSDKVERSION="36" --variable GITHUB_USERNAME="Jacksun84"

# 4. Copy your mobilertc.aar into the platform libs directory
mkdir -p platforms/android/app/libs
cp /path/to/your/mobilertc.aar platforms/android/app/libs/

# 5. Ensure gradle.properties includes heap configuration (copy from CordovaTestApp/gradle.properties in this zip)
cat <<EOT >> platforms/android/gradle.properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
android.useAndroidX=true
android.enableJetifier=true
android.useFullClasspathForDexingTransform=true
EOT


# 6. Build Android APK
cordova build android --verbose

# 7 Force Gradle to rerun tasks and ignore cached outputs
cordova build android --verbose -- --rerun-tasks --no-build-cache

# 9. Test Native Functions
# Run the application on an actual Android device (or an emulator with camera/microphone enabled) using:
cordova run android


# Gradle is using cache to improve the compilation time. When a cordova test app is locally created to build and test the plugin, all the changes to the cordova-zoom-plugin are not sincronized with the Cordova test app.
# For this reason 

# 1. Remove the cached plugin and platform from the project
cordova plugin rm cordova.plugin.zoom --variable GITHUB_TOKEN="token" --variable ANDROID-MINSDKVERSION="28" --variable ANDROID-TARGETSDKVERSION="36" --variable GITHUB_USERNAME="Jacksun84" --variable ANDROID-COMPILESDKVERSION="36"

cordova platform rm android

# 2. Re-add the plugin from your local path (use --link so changes mirror instantly)
cordova plugin add ../cordova-zoom-plugin --link --variable GITHUB_TOKEN="token" --variable ANDROID-MINSDKVERSION="28" --variable ANDROID-TARGETSDKVERSION="36" --variable GITHUB_USERNAME="Jacksun84"  --variable ANDROID-COMPILESDKVERSION="36"

cordova platform add android

# 3. Build the android platform
cordova build android -- -- --rerun-tasks --no-build-cache

# or only these 3, but the first one should solve the issues.
cordova platform rm android
cordova platform add android
cordova build android -- -- --rerun-tasks --no-build-cache
```


Step 1: Run Detailed Gradle Debug Commands
Run the native Gradle wrapper directly from the platforms/android directory:

Bash
cd platforms/android
gradlew.bat cdvBuildDebug --stacktrace --info

This output prints the exact class inside zoom-sdk-android-7.1.6.41900.aar that triggered the Record desugaring exception.