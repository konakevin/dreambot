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

  public func definition() -> ModuleDefinition {
    Name("DreamBotWidget")

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
