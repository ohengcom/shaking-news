"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Database, Trash2, RefreshCw, HardDrive, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { cacheManager, type CacheStats, type CacheConfig, type CacheEntry } from "@/lib/cache-manager"

interface CacheManagerUIProps {
  onConfigChange?: (config: CacheConfig) => void
}

export default function CacheManagerUI({ onConfigChange }: CacheManagerUIProps) {
  const [stats, setStats] = useState<CacheStats>({ totalEntries: 0, totalSize: 0, hitRate: 0, missRate: 0 })
  const [config, setConfig] = useState<CacheConfig>(cacheManager.getConfig())
  const [entries, setEntries] = useState<CacheEntry[]>([])
  const [isClearing, setIsClearing] = useState(false)

  const refreshData = () => {
    setStats(cacheManager.getStats())
    setConfig(cacheManager.getConfig())
    setEntries(cacheManager.getAllEntries())
  }

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const handleConfigChange = (updates: Partial<CacheConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    cacheManager.updateConfig(newConfig)
    onConfigChange?.(newConfig)
    refreshData()
  }

  const handleClearCache = async () => {
    setIsClearing(true)
    cacheManager.clear()
    await new Promise((resolve) => setTimeout(resolve, 500)) // Visual feedback
    refreshData()
    setIsClearing(false)
  }

  const handleDeleteEntry = (key: string) => {
    cacheManager.delete(key)
    refreshData()
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const hours = Math.floor(diffInMinutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const getEntryStatus = (entry: CacheEntry): "fresh" | "expiring" | "expired" => {
    const now = Date.now()
    const timeLeft = entry.expiresAt - now
    const totalTTL = entry.expiresAt - entry.timestamp

    if (timeLeft <= 0) return "expired"
    if (timeLeft < totalTTL * 0.2) return "expiring" // Less than 20% time left
    return "fresh"
  }

  const maxSizeBytes = config.maxSize * 1024 * 1024
  const sizeUsagePercent = (stats.totalSize / maxSizeBytes) * 100
  const entryUsagePercent = (stats.totalEntries / config.maxEntries) * 100

  return (
    <div className="space-y-6">
      {/* Cache Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Cache Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-800">{stats.totalEntries}</div>
              <div className="text-sm text-muted-foreground">Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-800">{formatBytes(stats.totalSize)}</div>
              <div className="text-sm text-muted-foreground">Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(stats.hitRate * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Hit Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{(stats.missRate * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Miss Rate</div>
            </div>
          </div>

          {/* Usage Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Storage Usage</span>
                <span>
                  {formatBytes(stats.totalSize)} / {formatBytes(maxSizeBytes)}
                </span>
              </div>
              <Progress value={Math.min(sizeUsagePercent, 100)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Entry Count</span>
                <span>
                  {stats.totalEntries} / {config.maxEntries}
                </span>
              </div>
              <Progress value={Math.min(entryUsagePercent, 100)} className="h-2" />
            </div>
          </div>

          {stats.oldestEntry && stats.newestEntry && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Oldest: {formatTimeAgo(stats.oldestEntry)}</span>
                <span>Newest: {formatTimeAgo(stats.newestEntry)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cache Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Cache Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Cache */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Caching</Label>
              <p className="text-sm text-muted-foreground">Store RSS feeds and articles for faster loading</p>
            </div>
            <Switch checked={config.enabled} onCheckedChange={(checked) => handleConfigChange({ enabled: checked })} />
          </div>

          {config.enabled && (
            <>
              <Separator />

              {/* Max Size */}
              <div>
                <Label className="text-base font-medium">Maximum Cache Size</Label>
                <p className="text-sm text-muted-foreground mb-3">Total storage limit for cached data</p>
                <div className="space-y-3">
                  <Slider
                    value={[config.maxSize]}
                    onValueChange={([value]) => handleConfigChange({ maxSize: value })}
                    min={10}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>10 MB</span>
                    <span className="font-medium">{config.maxSize} MB</span>
                    <span>200 MB</span>
                  </div>
                </div>
              </div>

              {/* Default TTL */}
              <div>
                <Label className="text-base font-medium">Default Cache Duration</Label>
                <p className="text-sm text-muted-foreground mb-3">How long to keep cached data</p>
                <div className="space-y-3">
                  <Slider
                    value={[config.defaultTTL]}
                    onValueChange={([value]) => handleConfigChange({ defaultTTL: value })}
                    min={5}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5 min</span>
                    <span className="font-medium">{config.defaultTTL} minutes</span>
                    <span>2 hours</span>
                  </div>
                </div>
              </div>

              {/* Max Entries */}
              <div>
                <Label className="text-base font-medium">Maximum Entries</Label>
                <p className="text-sm text-muted-foreground mb-3">Maximum number of cached items</p>
                <div className="space-y-3">
                  <Slider
                    value={[config.maxEntries]}
                    onValueChange={([value]) => handleConfigChange({ maxEntries: value })}
                    min={100}
                    max={5000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>100</span>
                    <span className="font-medium">{config.maxEntries} entries</span>
                    <span>5,000</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Cache Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Cache Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" onClick={refreshData} className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              Refresh Stats
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearCache}
              disabled={isClearing || stats.totalEntries === 0}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isClearing ? "Clearing..." : "Clear All Cache"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cache Entries */}
      {config.enabled && entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Cached Entries ({entries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entries.map((entry) => {
                const status = getEntryStatus(entry)
                const timeLeft = Math.max(0, entry.expiresAt - Date.now())
                const minutesLeft = Math.floor(timeLeft / (1000 * 60))

                return (
                  <div
                    key={entry.key}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{entry.key}</code>
                        <Badge
                          className={
                            status === "fresh"
                              ? "bg-green-100 text-green-800"
                              : status === "expiring"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {status === "fresh" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {status === "expiring" && <AlertCircle className="w-3 h-3 mr-1" />}
                          {status === "expired" && <AlertCircle className="w-3 h-3 mr-1" />}
                          {status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatBytes(entry.size)}</span>
                        <span>Created {formatTimeAgo(new Date(entry.timestamp))}</span>
                        <span>{status === "expired" ? "Expired" : `Expires in ${minutesLeft}m`}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.key)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
