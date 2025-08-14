"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus, Rss, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export interface RSSFeed {
  id: string
  name: string
  url: string
  enabled: boolean
  lastFetched?: Date
  status: "active" | "error" | "pending"
  articleCount?: number
}

interface RSSManagerProps {
  feeds: RSSFeed[]
  onFeedsChange: (feeds: RSSFeed[]) => void
  onActiveFeedChange: (feedId: string) => void
  activeFeedId?: string
}

export default function RSSManager({ feeds, onFeedsChange, onActiveFeedChange, activeFeedId }: RSSManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFeedName, setNewFeedName] = useState("")
  const [newFeedUrl, setNewFeedUrl] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  const validateRSSUrl = async (url: string): Promise<boolean> => {
    try {
      // Basic URL validation
      new URL(url)
      // In a real app, you'd validate the RSS feed here
      return true
    } catch {
      return false
    }
  }

  const handleAddFeed = async () => {
    if (!newFeedName.trim() || !newFeedUrl.trim()) return

    setIsValidating(true)
    const isValid = await validateRSSUrl(newFeedUrl)

    if (isValid) {
      const newFeed: RSSFeed = {
        id: Date.now().toString(),
        name: newFeedName.trim(),
        url: newFeedUrl.trim(),
        enabled: true,
        status: "pending",
        lastFetched: new Date(),
        articleCount: 0,
      }

      onFeedsChange([...feeds, newFeed])
      setNewFeedName("")
      setNewFeedUrl("")
      setIsAddDialogOpen(false)
    }

    setIsValidating(false)
  }

  const handleRemoveFeed = (feedId: string) => {
    const updatedFeeds = feeds.filter((feed) => feed.id !== feedId)
    onFeedsChange(updatedFeeds)

    if (activeFeedId === feedId && updatedFeeds.length > 0) {
      onActiveFeedChange(updatedFeeds[0].id)
    }
  }

  const handleToggleFeed = (feedId: string) => {
    const updatedFeeds = feeds.map((feed) => (feed.id === feedId ? { ...feed, enabled: !feed.enabled } : feed))
    onFeedsChange(updatedFeeds)
  }

  const getStatusIcon = (status: RSSFeed["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusColor = (status: RSSFeed["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rss className="w-5 h-5 text-cyan-800" />
            <CardTitle className="font-sans font-bold">RSS Feed Sources</CardTitle>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-cyan-800 hover:bg-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Feed
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add RSS Feed</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="feed-name">Feed Name</Label>
                  <Input
                    id="feed-name"
                    placeholder="e.g., Tech News Daily"
                    value={newFeedName}
                    onChange={(e) => setNewFeedName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="feed-url">RSS URL</Label>
                  <Input
                    id="feed-url"
                    placeholder="https://www.888388.xyz/rss.xml"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddFeed}
                    disabled={!newFeedName.trim() || !newFeedUrl.trim() || isValidating}
                    className="bg-cyan-800 hover:bg-cyan-700"
                  >
                    {isValidating ? "Validating..." : "Add Feed"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feeds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Rss className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No RSS feeds configured</p>
              <p className="text-sm">Add your first RSS feed to get started</p>
            </div>
          ) : (
            feeds.map((feed) => (
              <div
                key={feed.id}
                className={`p-4 rounded-lg border transition-all ${
                  activeFeedId === feed.id ? "border-cyan-500 bg-cyan-50/50" : "border-border hover:border-cyan-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(feed.status)}
                      <Switch checked={feed.enabled} onCheckedChange={() => handleToggleFeed(feed.id)} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{feed.name}</h4>
                        <Badge className={getStatusColor(feed.status)}>{feed.status}</Badge>
                        {activeFeedId === feed.id && <Badge className="bg-cyan-100 text-cyan-800">Active</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          {new URL(feed.url).hostname}
                        </span>
                        {feed.articleCount !== undefined && <span>{feed.articleCount} articles</span>}
                        {feed.lastFetched && <span>Updated {feed.lastFetched.toLocaleTimeString()}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onActiveFeedChange(feed.id)}
                      disabled={!feed.enabled || activeFeedId === feed.id}
                    >
                      {activeFeedId === feed.id ? "Active" : "Use"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFeed(feed.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
