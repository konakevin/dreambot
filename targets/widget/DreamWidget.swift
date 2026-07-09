/**
 * DreamWidget — DreamBot's Home Screen widget (v1: rotating glance widget).
 *
 * Shows the user's recent dreams full-bleed, rotating every 2 hours through
 * the last ~6 (newest first, so the freshest dream leads after every reload).
 * Tap opens that exact dream via deep link (dreambot://photo/<id>); the app's
 * existing notification-style routing scopes it to a single-item album.
 *
 * Data contract (written by lib/widgetSync.ts through modules/dreambot-widget):
 *   - UserDefaults(suiteName: APP_GROUP)["widget_state"] = JSON:
 *       { "dreams": [{ "id": "<uuid>", "file": "<name>.jpg" }], "updatedAt": ms }
 *   - Image files live in <group container>/widget/<file>, pre-sized to the
 *     feed display variant (widgets have a ~30MB memory ceiling — never point
 *     this at HQ originals).
 *
 * Empty state (no dreams yet): branded "Dream something tonight" card that
 * deep-links to the Create tab (dreambot://create).
 */

import ImageIO
import SwiftUI
import WidgetKit

let APP_GROUP = "group.com.konakevin.radorbad"

// MARK: - Shared-state model

struct WidgetDreamRef: Decodable {
  let id: String
  let file: String
}

struct WidgetState: Decodable {
  let dreams: [WidgetDreamRef]
}

func loadWidgetState() -> WidgetState? {
  guard let json = UserDefaults(suiteName: APP_GROUP)?.string(forKey: "widget_state"),
    let data = json.data(using: .utf8)
  else { return nil }
  return try? JSONDecoder().decode(WidgetState.self, from: data)
}

/// Load a dream image DOWNSAMPLED via ImageIO. Never decode these at full
/// size: the sync writes ~768×1344 files, which decode to ~4MB of bitmap
/// each — six timeline entries of those (~25MB) blows WidgetKit's ~30MB
/// memory ceiling, the extension is killed mid-archive, and the widget
/// sticks on its redacted placeholder (exactly what shipped v0 did; the
/// gallery preview worked because a snapshot is a single entry).
/// 700px max keeps six entries under ~7MB total.
func loadDreamImage(_ fileName: String, maxPixels: CGFloat = 700) -> UIImage? {
  guard
    let container = FileManager.default.containerURL(
      forSecurityApplicationGroupIdentifier: APP_GROUP)
  else { return nil }
  let url = container.appendingPathComponent("widget", isDirectory: true)
    .appendingPathComponent(fileName)
  let srcOptions: [CFString: Any] = [kCGImageSourceShouldCache: false]
  guard let source = CGImageSourceCreateWithURL(url as CFURL, srcOptions as CFDictionary)
  else { return nil }
  let thumbOptions: [CFString: Any] = [
    kCGImageSourceCreateThumbnailFromImageAlways: true,
    kCGImageSourceCreateThumbnailWithTransform: true,
    kCGImageSourceShouldCacheImmediately: true,
    kCGImageSourceThumbnailMaxPixelSize: maxPixels,
  ]
  guard let cgImage = CGImageSourceCreateThumbnailAtIndex(source, 0, thumbOptions as CFDictionary)
  else { return nil }
  return UIImage(cgImage: cgImage)
}

// MARK: - Timeline

struct DreamEntry: TimelineEntry {
  let date: Date
  let dreamId: String?
  let image: UIImage?
}

struct DreamProvider: TimelineProvider {
  func placeholder(in context: Context) -> DreamEntry {
    DreamEntry(date: .now, dreamId: nil, image: nil)
  }

  func getSnapshot(in context: Context, completion: @escaping (DreamEntry) -> Void) {
    completion(firstEntry())
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<DreamEntry>) -> Void) {
    guard let state = loadWidgetState(), !state.dreams.isEmpty else {
      // No dreams yet — single empty-state entry; the app reloads timelines
      // the moment a dream lands, so .never is fine here.
      let timeline = Timeline(
        entries: [DreamEntry(date: .now, dreamId: nil, image: nil)], policy: .never)
      completion(timeline)
      return
    }
    // Rotate through the dreams every 2 hours, newest first. One entry per
    // dream (12h of timeline for 6 dreams); .atEnd re-rolls from the top so
    // the rotation loops without spending refresh budget.
    var entries: [DreamEntry] = []
    let stepSeconds: TimeInterval = 2 * 60 * 60
    for (i, dream) in state.dreams.enumerated() {
      entries.append(
        DreamEntry(
          date: Date(timeIntervalSinceNow: stepSeconds * Double(i)),
          dreamId: dream.id,
          image: loadDreamImage(dream.file)
        ))
    }
    completion(Timeline(entries: entries, policy: .atEnd))
  }

  private func firstEntry() -> DreamEntry {
    guard let state = loadWidgetState(), let first = state.dreams.first else {
      return DreamEntry(date: .now, dreamId: nil, image: nil)
    }
    return DreamEntry(date: .now, dreamId: first.id, image: loadDreamImage(first.file))
  }
}

// MARK: - Views

struct DreamWidgetView: View {
  var entry: DreamEntry

  var body: some View {
    if let image = entry.image, let dreamId = entry.dreamId {
      // Full-bleed dream. Color.clear.overlay keeps scaledToFill from blowing
      // the layout past the widget bounds.
      Color.clear
        .overlay(
          Image(uiImage: image)
            .resizable()
            .scaledToFill()
        )
        .clipped()
        .containerBackground(Color.black, for: .widget)
        .widgetURL(URL(string: "dreambot://photo/\(dreamId)"))
    } else {
      // Empty state — branded nudge into Create. Accent matches the app's
      // #A78BFA purple (colors as literals: asset-catalog names generated by
      // the target config are an indirection we don't need for two values).
      VStack(spacing: 6) {
        Image(systemName: "sparkles")
          .font(.system(size: 22, weight: .semibold))
          .foregroundStyle(Color(red: 0.655, green: 0.545, blue: 0.980))
        Text("Dream something\ntonight")
          .font(.system(size: 13, weight: .semibold))
          .multilineTextAlignment(.center)
          .foregroundStyle(.white.opacity(0.92))
      }
      .containerBackground(Color.black, for: .widget)
      .widgetURL(URL(string: "dreambot://create"))
    }
  }
}

// MARK: - Widget

struct DreamWidget: Widget {
  let kind = "DreamWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: DreamProvider()) { entry in
      DreamWidgetView(entry: entry)
    }
    .configurationDisplayName("Dreams")
    .description("Your latest dreams, rotating through the day.")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .contentMarginsDisabled()
  }
}

@main
struct DreamWidgetBundle: WidgetBundle {
  var body: some Widget {
    DreamWidget()
  }
}
