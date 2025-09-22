# Reanimated (required for Hermes + release build)
-keep class com.swmansion.reanimated.** { *; }
-keepclassmembers class * {
  @com.swmansion.reanimated.annotations.ReactProp <methods>;
}

# Keep JS module names (avoid stripping)
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Optional: Prevent obfuscation of classes used by React Native
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**
