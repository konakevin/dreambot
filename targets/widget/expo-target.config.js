/**
 * DreamBot Home Screen widget target — generated + linked into the Xcode
 * project by @bacons/apple-targets on every prebuild. The widget itself is
 * SwiftUI (DreamWidget.swift, this folder); it reads its data from the App
 * Group container that lib/widgetSync.ts fills via modules/dreambot-widget.
 *
 * Bundle id is derived automatically: <app bundle id>.widget.
 * deploymentTarget 17.0 (app floor is 16.0) for containerBackground +
 * contentMarginsDisabled — iOS 16 users simply don't see the widget in the
 * gallery, which is the correct degradation.
 */
/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'widget',
  name: 'DreamBotWidget',
  deploymentTarget: '17.0',
  colors: {
    $widgetBackground: '#000000',
    $accent: '#A78BFA',
  },
  entitlements: {
    'com.apple.security.application-groups': ['group.com.konakevin.radorbad'],
  },
};
