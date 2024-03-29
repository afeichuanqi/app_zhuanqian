package com.yiertong.easyz;
import android.os.Bundle; // <- add necessary import
import com.facebook.react.ReactActivity;
import com.yiertong.easyz.R;
import com.zoontek.rnbootsplash.RNBootSplash; // <- add necessary import
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import cn.jiguang.share.android.api.JShareInterface;     // <--  Import JShareInterface

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JShareInterface.setDebugMode(true);
        JShareInterface.init(this);             //   <-- Init here
        RNBootSplash.show(R.drawable.bootsplash, MainActivity.this); // <- display the "bootsplash" xml view over our MainActivity
    }
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "AwesomeProject";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

}
