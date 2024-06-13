# NLFCS

Do this stpes before build 

1.  open node modules => react-native-scanner-plugin => android => build.gradlew file
2.  change the class path to 7.3.1
3.  DocumentScanner_compileSdkVersion : 33
4.  DocumentScanner_minSdkVersion : 21
5.  DocumentScanner_targetSdkVersion : 33



like this
  dependencies {
            classpath 'com.android.tools.build:gradle:7.3.1'
        }

android {
    compileSdkVersion safeExtGet('DocumentScanner_compileSdkVersion', 33)
    defaultConfig {
        minSdkVersion safeExtGet('DocumentScanner_minSdkVersion', 21)
        targetSdkVersion safeExtGet('DocumentScanner_targetSdkVersion', 33)
    }