require 'json'

Pod::Spec.new do |s|
  s.name           = 'DreamBotWidgetBridge'
  s.version        = '1.0.0'
  s.summary        = 'App Group bridge for the DreamBot Home Screen widget'
  s.description    = 'Writes widget state into the shared App Group and reloads WidgetKit timelines.'
  s.author         = 'DreamBot'
  s.homepage       = 'https://dreambotapp.com'
  s.platforms      = { :ios => '16.0' }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.license        = { :type => 'MIT' }

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = '**/*.{h,m,swift}'
end
