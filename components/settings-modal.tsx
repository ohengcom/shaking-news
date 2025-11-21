"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { AuthButton } from "@/components/auth-button"
import { TEXTS, DEFAULT_SOURCES } from "@/lib/constants"

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
    frequency: number
    onFrequencyChange: (freq: number) => void
    maxTiltAngle: number
    onMaxTiltAngleChange: (angle: number) => void
    showStatus: boolean
    onShowStatusChange: (show: boolean) => void
    fontSize: string
    onFontSizeChange: (size: string) => void
    language: "zh" | "en"
    onLanguageChange: (lang: "zh" | "en") => void
    showAds: boolean
    onShowAdsChange: (show: boolean) => void
    dataSources: Array<{ id: number; name: string; url: string; active: boolean }>
    onDataSourcesChange: (sources: Array<{ id: number; name: string; url: string; active: boolean }>) => void
}

export function SettingsModal({
    isOpen,
    onClose,
    frequency,
    onFrequencyChange,
    maxTiltAngle,
    onMaxTiltAngleChange,
    showStatus,
    onShowStatusChange,
    fontSize,
    onFontSizeChange,
    language,
    onLanguageChange,
    showAds,
    onShowAdsChange,
    dataSources,
    onDataSourcesChange,
}: SettingsModalProps) {
    const [newSourceName, setNewSourceName] = useState("")
    const [newSourceUrl, setNewSourceUrl] = useState("")

    // Reset local state when modal opens or language changes
    useEffect(() => {
        if (!isOpen) {
            setNewSourceName("")
            setNewSourceUrl("")
        }
    }, [isOpen])

    const t = TEXTS[language]

    const addDataSource = () => {
        if (newSourceName && newSourceUrl) {
            const newSource = {
                id: Date.now(),
                name: newSourceName,
                url: newSourceUrl,
                active: true,
            }
            onDataSourcesChange([...dataSources, newSource])
            setNewSourceName("")
            setNewSourceUrl("")
        }
    }

    const removeDataSource = (id: number) => {
        onDataSourcesChange(dataSources.filter((source) => source.id !== id))
    }

    const toggleDataSource = (id: number) => {
        onDataSourcesChange(
            dataSources.map((source) => (source.id === id ? { ...source, active: !source.active } : source))
        )
    }

    if (!isOpen) return null

    return (
        <div className="fixed right-0 top-0 h-full w-1/4 min-w-80 bg-white bg-opacity-95 backdrop-blur-sm shadow-2xl overflow-y-auto z-50">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-green-800">{t.settings}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-green-100 rounded-full transition-colors">
                        <X size={20} className="text-green-600" />
                    </button>
                </div>

                {/* Authentication Section */}
                <div className="mb-5">
                    <h3 className="text-base font-semibold mb-2 text-green-700">{t.account}</h3>
                    <AuthButton language={language} />
                    <p className="text-xs text-green-500 mt-1">{t.syncHint}</p>
                </div>

                {/* Language Settings Section */}
                <div className="mb-5">
                    <div className="mb-3">
                        <label className="block text-xs font-medium mb-1 text-green-600">{t.language}</label>
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value as "zh" | "en")}
                            className="w-full px-2 py-1 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-xs"
                        >
                            <option value="zh">中文</option>
                            <option value="en">English</option>
                        </select>
                        <p className="text-xs text-green-500 mt-1">{t.languageHint}</p>
                    </div>
                </div>

                {/* Shaking Settings Section */}
                <div className="mb-5">
                    <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                            <label className="block text-xs font-medium mb-1 text-green-600">{t.frequency}</label>
                            <input
                                type="number"
                                min="5"
                                max="300"
                                value={frequency}
                                onChange={(e) => onFrequencyChange(Number(e.target.value))}
                                className="w-full px-2 py-1 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-xs"
                            />
                            <p className="text-xs text-green-500 mt-1">{t.frequencyHint}</p>
                        </div>

                        <div className="flex-1">
                            <label className="block text-xs font-medium mb-1 text-green-600">{t.maxTiltAngle}</label>
                            <input
                                type="number"
                                min="5"
                                max="45"
                                value={maxTiltAngle}
                                onChange={(e) => onMaxTiltAngleChange(Number(e.target.value))}
                                className="w-full px-2 py-1 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-xs"
                            />
                            <p className="text-xs text-green-500 mt-1">{t.maxTiltAngleHint}</p>
                        </div>
                    </div>
                </div>

                {/* Font Size Settings Section */}
                <div className="mb-5">
                    <div className="mb-3">
                        <label className="block text-xs font-medium mb-1 text-green-600">{t.fontSize}</label>
                        <select
                            value={fontSize}
                            onChange={(e) => onFontSizeChange(e.target.value)}
                            className="w-full px-2 py-1 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-xs"
                        >
                            <option value="text-xs">{t.small}</option>
                            <option value="text-sm">{t.medium}</option>
                            <option value="text-base">{t.large}</option>
                        </select>
                        <p className="text-xs text-green-500 mt-1">{t.fontSizeHint}</p>
                    </div>
                </div>

                {/* Display Options Section */}
                <div className="mb-5">
                    <div className="flex gap-6 mb-3">
                        <div className="flex-1">
                            <label className="flex items-center gap-2 text-xs font-medium text-green-600">
                                <input
                                    type="checkbox"
                                    checked={showStatus}
                                    onChange={(e) => onShowStatusChange(e.target.checked)}
                                    className="w-3 h-3 text-green-600 rounded focus:ring-green-500"
                                />
                                {t.showStatus}
                            </label>
                            <p className="text-xs text-green-500 mt-1">{t.showStatusHint}</p>
                        </div>

                        <div className="flex-1">
                            <label className="flex items-center gap-2 text-xs font-medium text-green-600">
                                <input
                                    type="checkbox"
                                    checked={showAds}
                                    onChange={(e) => onShowAdsChange(e.target.checked)}
                                    className="w-3 h-3 text-green-600 rounded focus:ring-green-500"
                                />
                                {t.showAds}
                            </label>
                            <p className="text-xs text-green-500 mt-1">{t.showAdsHint}</p>
                        </div>
                    </div>
                </div>

                {/* Data Source Settings */}
                <div className="mb-5">
                    <h3 className="text-base font-semibold mb-2 text-green-700">{t.dataSourceSettings}</h3>

                    {/* Current Data Sources */}
                    <div className="space-y-2 mb-3">
                        {dataSources.map((source) => (
                            <div key={source.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={source.active}
                                    onChange={() => toggleDataSource(source.id)}
                                    className="w-3 h-3 text-green-600 rounded focus:ring-green-500"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-green-800 truncate text-xs">{source.name}</div>
                                    <div className="text-xs text-green-600 truncate">{source.url}</div>
                                </div>
                                {dataSources.length > 1 && (
                                    <button
                                        onClick={() => removeDataSource(source.id)}
                                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                    >
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add New Data Source */}
                    <div className="space-y-2 p-2 bg-gray-50 rounded-lg">
                        <h4 className="text-xs font-medium text-green-700">{t.addNewSource}</h4>
                        <input
                            type="text"
                            placeholder={t.sourceName}
                            value={newSourceName}
                            onChange={(e) => setNewSourceName(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs"
                        />
                        <input
                            type="url"
                            placeholder={t.sourceUrl}
                            value={newSourceUrl}
                            onChange={(e) => setNewSourceUrl(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs"
                        />
                        <button
                            onClick={addDataSource}
                            disabled={!newSourceName || !newSourceUrl}
                            className="w-full flex items-center justify-center gap-2 px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                        >
                            <Plus size={16} />
                            {t.addSource}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
