import ExpoModulesCore
import DeviceCheck

// Bridges Apple's DeviceCheck to JS. DCDevice.generateToken() returns a
// per-device token that our server exchanges (with the .p8 key) for the two
// persistent DeviceCheck bits — bit0 = "this device already used its free trial".
// See TRIAL_FARMING_PREVENTION.md (Anchor A).
public class ExpoDeviceCheckModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoDeviceCheck")

    // Resolves a base64 token, or nil on a device/OS where DeviceCheck is
    // unsupported (Simulator). The JS wrapper treats nil as "unattested" and the
    // server fails open, so onboarding is never blocked.
    AsyncFunction("generateToken") { (promise: Promise) in
      guard DCDevice.current.isSupported else {
        promise.resolve(nil)
        return
      }
      DCDevice.current.generateToken { data, error in
        if let error = error {
          promise.reject("ERR_DEVICE_CHECK", error.localizedDescription)
          return
        }
        promise.resolve(data?.base64EncodedString())
      }
    }
  }
}
