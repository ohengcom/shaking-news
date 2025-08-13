"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, RotateCcw, Palette, Activity, Monitor, Moon, Sun, Database } from "lucide-react"
import CacheManagerUI from "./cache-manager-ui"

export interface AppSettings {
  // Rotation Settings
  rotationMode: "soft" | "continuous" | "paused"
  continuousInterval: number // seconds
  softIntensity: number // 1-10 scale
  customIntervals: number[] // preset intervals in seconds

  // Display Settings
  theme: "light" | "dark" | "system"
  compactMode: boolean
  showTimestamps: boolean
  articlesPerPage: number

  // Wellness Settings
  wellnessReminders: boolean
  reminderInterval: number // minutes
  exercisePrompts: boolean
  neckExerciseTypes: string[]

  // Notification Settings
  soundEnabled: boolean
  vibrationEnabled: boolean
  rotationNotifications: boolean

  // Advanced Settings
  autoRefresh: boolean
  refreshInterval: number // minutes
  cacheEnabled: boolean
  analyticsEnabled: boolean
}

interface SettingsPanelProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
}

const defaultExercises = [
  "Neck rolls",
  "Side stretches",
  "Forward/backward tilts",
  "Shoulder shrugs",
  "Upper trap stretches",
]

export default function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"rotation" | "display" | "wellness" | "cache" | "advanced">("rotation")

  const updateSettings = (updates: Partial<AppSettings>) => {
    onSettingsChange({ ...settings, ...updates })
  }

  const addCustomInterval = () => {
    const newInterval = 60 // default 60 seconds
    if (!settings.customIntervals.includes(newInterval)) {
      updateSettings({
        customIntervals: [...settings.customIntervals, newInterval].sort((a, b) => a - b),
      })
    }
  }

  const removeCustomInterval = (interval: number) => {
    updateSettings({
      customIntervals: settings.customIntervals.filter((i) => i !== interval),
    })
  }

  const toggleExerciseType = (exercise: string) => {
    const current = settings.neckExerciseTypes
    const updated = current.includes(exercise) ? current.filter((e) => e !== exercise) : [...current, exercise]
    updateSettings({ neckExerciseTypes: updated })
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds === 0 ? `${minutes}m` : `${minutes}m ${remainingSeconds}s`
  }

  const tabs = [
    { id: "rotation", label: "Rotation", icon: RotateCcw },
    { id: "display", label: "Display", icon: Monitor },
    { id: "wellness", label: "Wellness", icon: Activity },
    { id: "cache", label: "Cache", icon: Database },
    { id: "advanced", label: "Advanced", icon: Settings },
  ] as const

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 ${activeTab === tab.id ? "bg-cyan-800 hover:bg-cyan-700" : ""}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Rotation Settings */}
      {activeTab === "rotation" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Rotation Mode Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Continuous Mode Settings */}
              <div>
                <Label className="text-base font-medium">Continuous Mode Interval</Label>
                <p className="text-sm text-muted-foreground mb-3">How often the page completes a full rotation</p>
                <div className="space-y-3">
                  <Slider
                    value={[settings.continuousInterval]}
                    onValueChange={([value]) => updateSettings({ continuousInterval: value })}
                    min={10}
                    max={300}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>10s (Fast)</span>
                    <span className="font-medium">{formatTime(settings.continuousInterval)}</span>
                    <span>5m (Slow)</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Soft Mode Settings */}
              <div>
                <Label className="text-base font-medium">Soft Mode Intensity</Label>
                <p className="text-sm text-muted-foreground mb-3">Adjust the subtlety of gentle movements</p>
                <div className="space-y-3">
                  <Slider
                    value={[settings.softIntensity]}
                    onValueChange={([value]) => updateSettings({ softIntensity: value })}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 (Barely noticeable)</span>
                    <span className="font-medium">Level {settings.softIntensity}</span>
                    <span>10 (More pronounced)</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Custom Intervals */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-medium">Custom Intervals</Label>
                  <Button size="sm" variant="outline" onClick={addCustomInterval}>
                    Add Preset
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Create your own rotation timing presets</p>
                <div className="flex flex-wrap gap-2">
                  {settings.customIntervals.map((interval) => (
                    <Badge
                      key={interval}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeCustomInterval(interval)}
                    >
                      {formatTime(interval)} ×
                    </Badge>
                  ))}
                  {settings.customIntervals.length === 0 && (
                    <span className="text-sm text-muted-foreground">No custom intervals set</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Display Settings */}
      {activeTab === "display" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground mb-3">Choose your preferred color scheme</p>
                <Select value={settings.theme} onValueChange={(value: any) => updateSettings({ theme: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Layout Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce spacing and padding for more content</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSettings({ compactMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Show Timestamps</Label>
                    <p className="text-sm text-muted-foreground">Display publication times on articles</p>
                  </div>
                  <Switch
                    checked={settings.showTimestamps}
                    onCheckedChange={(checked) => updateSettings({ showTimestamps: checked })}
                  />
                </div>
              </div>

              <Separator />

              {/* Articles Per Page */}
              <div>
                <Label className="text-base font-medium">Articles Per Page</Label>
                <p className="text-sm text-muted-foreground mb-3">Number of articles to display at once</p>
                <Select
                  value={settings.articlesPerPage.toString()}
                  onValueChange={(value) => updateSettings({ articlesPerPage: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 articles</SelectItem>
                    <SelectItem value="6">6 articles</SelectItem>
                    <SelectItem value="8">8 articles</SelectItem>
                    <SelectItem value="12">12 articles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Wellness Settings */}
      {activeTab === "wellness" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Wellness & Health Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wellness Reminders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Wellness Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get periodic reminders to check your posture</p>
                  </div>
                  <Switch
                    checked={settings.wellnessReminders}
                    onCheckedChange={(checked) => updateSettings({ wellnessReminders: checked })}
                  />
                </div>

                {settings.wellnessReminders && (
                  <div>
                    <Label className="text-sm font-medium">Reminder Frequency</Label>
                    <div className="mt-2">
                      <Slider
                        value={[settings.reminderInterval]}
                        onValueChange={([value]) => updateSettings({ reminderInterval: value })}
                        min={5}
                        max={60}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>5 min</span>
                        <span className="font-medium">Every {settings.reminderInterval} minutes</span>
                        <span>60 min</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Exercise Prompts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Exercise Prompts</Label>
                    <p className="text-sm text-muted-foreground">Show specific neck exercise suggestions</p>
                  </div>
                  <Switch
                    checked={settings.exercisePrompts}
                    onCheckedChange={(checked) => updateSettings({ exercisePrompts: checked })}
                  />
                </div>

                {settings.exercisePrompts && (
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Preferred Exercise Types</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {defaultExercises.map((exercise) => (
                        <div key={exercise} className="flex items-center space-x-2">
                          <Switch
                            checked={settings.neckExerciseTypes.includes(exercise)}
                            onCheckedChange={() => toggleExerciseType(exercise)}
                            size="sm"
                          />
                          <Label className="text-sm">{exercise}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cache Management */}
      {activeTab === "cache" && (
        <div className="space-y-6">
          <CacheManagerUI
            onConfigChange={(config) => {
              updateSettings({ cacheEnabled: config.enabled })
            }}
          />
        </div>
      )}

      {/* Advanced Settings */}
      {activeTab === "advanced" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Advanced Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Refresh */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">Automatically fetch new articles</p>
                  </div>
                  <Switch
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => updateSettings({ autoRefresh: checked })}
                  />
                </div>

                {settings.autoRefresh && (
                  <div>
                    <Label className="text-sm font-medium">Refresh Interval</Label>
                    <div className="mt-2">
                      <Select
                        value={settings.refreshInterval.toString()}
                        onValueChange={(value) => updateSettings({ refreshInterval: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Every 5 minutes</SelectItem>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="60">Every hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Notifications</Label>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for reminders and alerts</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Rotation Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify when rotation mode changes</p>
                  </div>
                  <Switch
                    checked={settings.rotationNotifications}
                    onCheckedChange={(checked) => updateSettings({ rotationNotifications: checked })}
                  />
                </div>
              </div>

              <Separator />

              {/* System Settings */}
              <div className="space-y-4">
                <Label className="text-base font-medium">System</Label>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Enable Caching</Label>
                    <p className="text-sm text-muted-foreground">Cache articles for faster loading</p>
                  </div>
                  <Switch
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => updateSettings({ cacheEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
                  </div>
                  <Switch
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => updateSettings({ analyticsEnabled: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
