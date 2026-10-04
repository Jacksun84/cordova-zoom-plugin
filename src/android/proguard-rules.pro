# -------------------------------------------------------------
# 1. Preserve JNI Native Method Signatures (CRITICAL FOR ZOOM)
# -------------------------------------------------------------
-keepclasseswithmembernames class * {
    native <methods>;
}

# -------------------------------------------------------------
# 2. Keep Interfaces and Inner Classes for Zoom & WebRTC
# -------------------------------------------------------------
-keep interface us.zoom.** { *; }
-keep interface com.zipow.** { *; }
-keep interface us.zipow.** { *; }

-keep class us.zoom.** { *; }
-keep class com.zipow.** { *; }
-keep class us.zipow.** { *; }
-keep class org.webrtc.** { *; }
-keep class us.google.protobuf.** { *; }
-keep class com.google.crypto.tink.** { *; }

# Preserve Line Numbers and Attributes for JNI reflection
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod,Exceptions

# -------------------------------------------------------------
# 3. Existing Framework Keep Rules
# -------------------------------------------------------------
-keep class androidx.security.crypto.** { *; }
-keep class androidx.** { *; }
-keep class android.support.** { *; }
-keep class com.google.** { *; }

# Don't Warnings
-dontwarn com.android.**
-dontwarn com.google.**
-dontwarn com.microsoft.**
-dontwarn com.zipow.**
-dontwarn javax.lang.**
-dontwarn kotlin.jvm.internal.**
-dontwarn kotlinx.parcelize.**
-dontwarn org.**
-dontwarn us.zoom.**
-dontwarn xcrash.**
-dontwarn java.awt.**
-dontwarn javax.swing.**
-dontwarn kotlin.uuid.**
-dontwarn kotlin.uuid.ExperimentalUuidApi



# New ones (to test this, the minification needs to be enable for debug build)
-dontwarn com.android.billingclient.**
-dontwarn com.google.android.play.core.**
-dontwarn com.google.firebase.**
-dontwarn com.google.zxing.**
-dontwarn com.google.i18n.phonenumbers.**
-dontwarn com.google.mlkit.**
-dontwarn com.microsoft.intune.mam.**
-dontwarn com.scwang.smart.refresh.**
-dontwarn com.symbol.emdk.**
-dontwarn io.noties.markwon.**
-dontwarn io.noties.prism4j.**