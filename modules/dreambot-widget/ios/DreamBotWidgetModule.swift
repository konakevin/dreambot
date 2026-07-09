/**
 * DreamBotWidgetModule — the app-side half of the Home Screen widget.
 *
 * lib/widgetSync.ts downloads the latest dream images into the App Group
 * container directory (getAppGroupWidgetDir), then commits the state JSON
 * here (setWidgetState), which also asks WidgetKit to re-read its timeline.
 *
 * APP_GROUP must match targets/widget/DreamWidget.swift and the entitlements
 * in app.config.js + targets/widget/expo-target.config.js.
 */

import ExpoModulesCore
import WidgetKit

public class DreamBotWidgetModule: Module {
  private let appGroup = "group.com.konakevin.radorbad"

  // Process-lifetime JS-load counter (survives Metro/dev reloads, resets on a
  // real relaunch). modules/dreambot-widget/index.ts calls countJsLoad() once
  // per JS context; app/+native-intent.ts uses it to swallow the launch URL's
  // REPLAY on reload (iOS re-reports the widget deep link on every JS reload,
  // which kept yanking dev reloads back to the widget's dream).
  private static var jsLoadCount = 0

  public func definition() -> ModuleDefinition {
    Name("DreamBotWidget")

    Function("countJsLoad") { () -> Int in
      DreamBotWidgetModule.jsLoadCount += 1
      return DreamBotWidgetModule.jsLoadCount
    }

    // Absolute path of the shared directory widget images live in (created on
    // first call). Returns nil if the App Group entitlement is missing (old
    // build) — JS treats nil as "widget unsupported" and no-ops.
    Function("getAppGroupWidgetDir") { () -> String? in
      guard
        let container = FileManager.default.containerURL(
          forSecurityApplicationGroupIdentifier: self.appGroup)
      else { return nil }
      let dir = container.appendingPathComponent("widget", isDirectory: true)
      try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
      return dir.path
    }

    // Commit the widget state JSON ({dreams: [{id, file}], updatedAt}) and
    // reload the widget timelines so the new dream shows up immediately.
    Function("setWidgetState") { (json: String) in
      UserDefaults(suiteName: self.appGroup)?.set(json, forKey: "widget_state")
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }
}
