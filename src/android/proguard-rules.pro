# Zoom SDK keep rules
-keep class com.zipow.** { *; }
-keep class us.zoom.** { *; }
-keep class com.jacksun.** { *; }
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-dontwarn us.zoom.**
-dontwarn com.zipow.**