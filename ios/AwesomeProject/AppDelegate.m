/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#import <CodePush/CodePush.h>
#import <RCTJShareModule.h>
#import "RNBootSplash.h"
#import "RNUMConfigure.h"


// ios 8.x or older

@implementation AppDelegate


// work in iOS(8.0)
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  [JSHAREService handleOpenUrl:url];
  return YES;
}
// work in iOS(9_0)
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url{
  [JSHAREService handleOpenUrl:url];
  return YES;
}
// work in iOS(9_0,++)
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  [JSHAREService handleOpenUrl:url];
  return YES;
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  ///* 设置友盟appkey */
  [UMConfigure setLogEnabled:YES];
  [RNUMConfigure initWithAppkey:@"5def3d7f0cafb21df800088a" channel:@"App Store"];
  //

//关闭强制验证https，可允许http图片分享，但需要在info.plist设置安全域名
 
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"AwesomeProject"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
 
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  //s启动图
 [RNBootSplash show:@"LaunchScreen" inView:rootView];
  //----
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
//  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  return [CodePush bundleURL];
#endif
}

@end
