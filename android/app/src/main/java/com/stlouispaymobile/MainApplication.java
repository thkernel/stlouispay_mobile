package com.stlouispaymobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import org.reactnative.camera.RNCameraPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.dialogprogress.DialogProgressPackage;
import com.reactnativerestart.RestartPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNCameraPackage(),
            new SvgPackage(),
            new NetInfoPackage(),
            new DialogProgressPackage(),
            new RestartPackage(),
            new LinearGradientPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new BackgroundTaskPackage(),
            new ReactNativePushNotificationPackage(),
            new SnackbarPackage(),
            new GeolocationPackage(),
            new AsyncStoragePackage()

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
     // BackgroundTaskPackage requirement
    BackgroundTaskPackage.useContext(this);
  }
}
