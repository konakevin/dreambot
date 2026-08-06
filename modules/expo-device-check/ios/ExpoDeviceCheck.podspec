Pod::Spec.new do |s|
  s.name           = 'ExpoDeviceCheck'
  s.version        = '1.0.0'
  s.summary        = 'DeviceCheck token bridge for DreamBot'
  s.description    = 'Exposes DCDevice.generateToken() to JS for the trial-farming gate.'
  s.author         = 'DreamBot'
  s.homepage       = 'https://dreambotapp.com'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
