# Prevent R8 from stripping Zoom SDK native interfaces and reflection classes
-keep class com.zipow.** { *; }
-keep class us.zoom.** { *; }
-keep class com.jacksun.** { *; }
-keep class cordova.plugin.zoom.** { *; }

-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-dontwarn us.zoom.**
-dontwarn com.zipow.**