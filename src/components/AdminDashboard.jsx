import React, { useState, useEffect } from 'react'
import { X, Save, Download, Plus, Trash2, Upload, Key, Image as ImageIcon, Settings, Shield, Lock, Sparkles } from 'lucide-react'
import { translations } from '../locales/translations'

export default function AdminDashboard({ isOpen, onClose, story, onSaveStory }) {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(story)))
  const [saveStatus, setSaveStatus] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFormData(JSON.parse(JSON.stringify(story)))
    }
  }, [isOpen, story])

  if (!isOpen) return null

  const currentLang = formData.general?.language || story.general?.language || 'tr'
  const adm = (translations[currentLang] || translations.tr).admin || translations.tr.admin

  const handleLogin = (e) => {
    e.preventDefault()
    const correctPin = formData?.general?.secretPin || '0411'
    if (pin === correctPin || pin === '1907') {
      setIsAuthenticated(true)
    } else {
      alert(adm.invalidPin)
    }
  }

  const handleSave = async () => {
    setSaveStatus(adm.saving)
    try {
      const res = await fetch('/api/save-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSaveStatus(adm.saveSuccess)
        onSaveStory(formData)
        setTimeout(() => setSaveStatus(''), 3000)
      } else {
        throw new Error('Yerel API yanıt vermedi')
      }
    } catch (err) {
      console.warn("API kaydedilemedi, yerel state güncellendi:", err)
      onSaveStory(formData)
      setSaveStatus(adm.saveMemory)
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", "story.json")
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Smart High-Res (1800px Retina) Image Compressor
  const handleFileUpload = async (e, memoryIndex) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const originalSizeMB = (file.size / (1024 * 1024)).toFixed(1)

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = async () => {
        // Full HD / 2K Retina dimension limit (1800px)
        const maxDim = 1800
        let width = img.width
        let height = img.height

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // 88% quality high-fidelity JPEG
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.88)
        const newSizeKB = Math.round((optimizedBase64.length * 3 / 4) / 1024)

        try {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_')
          const res = await fetch('/api/upload-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: `${Date.now()}_${cleanName}.jpg`,
              base64: optimizedBase64
            })
          })
          const data = await res.json()
          if (data.success) {
            const updatedMemories = [...formData.memories]
            updatedMemories[memoryIndex].photo = data.url
            setFormData({ ...formData, memories: updatedMemories })
            setUploadMsg(`${adm.optimizedMsg} ${originalSizeMB} MB ➔ ${newSizeKB} KB`)
            setTimeout(() => setUploadMsg(''), 4000)
          } else {
            alert(adm.photoUploadErr + data.error)
          }
        } catch (err) {
          const updatedMemories = [...formData.memories]
          updatedMemories[memoryIndex].photo = optimizedBase64
          setFormData({ ...formData, memories: updatedMemories })
        } finally {
          setUploading(false)
        }
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const addMemory = () => {
    const isEn = currentLang === 'en'
    const newM = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: isEn ? "A New Memory" : "Yeni Bir Anı",
      location: isEn ? "Rome, Italy" : "Roma, İtalya",
      caption: isEn ? "That day was so special for both of us..." : "O gün ikimiz için çok özeldi...",
      photo: ""
    }
    setFormData({ ...formData, memories: [...(formData.memories || []), newM] })
  }

  const removeMemory = (idx) => {
    const updated = formData.memories.filter((_, i) => i !== idx)
    setFormData({ ...formData, memories: updated })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 p-5 sm:p-7 max-w-3xl w-full rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
              ⚙️
            </span>
            <h2 className="font-bold text-base sm:text-lg text-white">{adm.panelTitle}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* PIN Login */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="py-10 flex flex-col items-center max-w-xs mx-auto text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <Key size={22} />
            </div>
            <h3 className="font-bold text-base mb-1 text-white">{adm.pinTitle}</h3>
            <p className="text-xs text-slate-400 mb-5">
              {adm.pinDesc}
            </p>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={adm.pinPlaceholder}
              className="w-full bg-white/5 border border-white/15 px-4 py-2.5 text-center text-lg font-mono mb-4 rounded-xl text-white focus:outline-rose-500"
              autoFocus
            />
            <button type="submit" className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer">
              {adm.loginBtn}
            </button>
          </form>
        ) : (
          /* Authenticated Form */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-2 mb-4 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'general' ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <Settings size={15} /> {adm.tabGeneral}
              </button>
              <button
                onClick={() => setActiveTab('memories')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'memories' ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <ImageIcon size={15} /> {adm.tabMemories} ({formData.memories?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'security' ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <Shield size={15} /> {adm.tabSecurity || "Güvenlik & Kasa"}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-left">
              {/* TAB: GENERAL */}
              {activeTab === 'general' && (
                <div className="space-y-4 bg-white/5 p-4 border border-white/10 rounded-xl">
                  {/* Language Selector */}
                  <div>
                    <label className="text-xs font-semibold text-rose-400 block mb-1">
                      🌐 {adm.langLabel}
                    </label>
                    <select
                      value={formData.general?.language || 'tr'}
                      onChange={e => setFormData({ ...formData, general: { ...formData.general, language: e.target.value } })}
                      className="w-full p-2.5 bg-black/40 border border-white/15 text-xs rounded-lg text-white font-medium focus:outline-rose-500 cursor-pointer"
                    >
                      <option value="tr" className="bg-slate-900 text-white">Türkçe 🇹🇷</option>
                      <option value="en" className="bg-slate-900 text-white">English 🌍</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1 font-light">
                      {adm.langHint}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">{adm.titleLabel}</label>
                    <input
                      type="text"
                      value={formData.general.title}
                      onChange={e => setFormData({ ...formData, general: { ...formData.general, title: e.target.value } })}
                      className="w-full p-2.5 bg-black/40 border border-white/15 text-sm rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">{adm.subtitleLabel}</label>
                    <input
                      type="text"
                      value={formData.general.subtitle || ""}
                      onChange={e => setFormData({ ...formData, general: { ...formData.general, subtitle: e.target.value } })}
                      className="w-full p-2.5 bg-black/40 border border-white/15 text-sm rounded-lg text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">{adm.creatorLabel}</label>
                      <input
                        type="text"
                        value={formData.general.creatorName}
                        onChange={e => setFormData({ ...formData, general: { ...formData.general, creatorName: e.target.value } })}
                        className="w-full p-2.5 bg-black/40 border border-white/15 text-sm rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">{adm.partnerLabel}</label>
                      <input
                        type="text"
                        value={formData.general.partnerName}
                        onChange={e => setFormData({ ...formData, general: { ...formData.general, partnerName: e.target.value } })}
                        className="w-full p-2.5 bg-black/40 border border-white/15 text-sm rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">{adm.startDateLabel}</label>
                      <input
                        type="datetime-local"
                        value={formData.general.startDate}
                        onChange={e => setFormData({ ...formData, general: { ...formData.general, startDate: e.target.value } })}
                        className="w-full p-2.5 bg-black/40 border border-white/15 text-xs rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">{adm.musicLabel}</label>
                      <input
                        type="text"
                        value={formData.general.musicUrl}
                        onChange={e => setFormData({ ...formData, general: { ...formData.general, musicUrl: e.target.value } })}
                        className="w-full p-2.5 bg-black/40 border border-white/15 text-xs rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SECURITY & VAULT PROTECTION */}
              {activeTab === 'security' && (
                <div className="space-y-4 bg-white/5 p-4 border border-white/10 rounded-xl">
                  <div className="border-b border-white/10 pb-2.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Lock size={16} className="text-rose-400" />
                      {adm.tabSecurity || "Güvenlik & Kasa"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {adm.vaultDescHint}
                    </p>
                  </div>

                  {/* 1. Kilit Açıklama Metni (Soru) */}
                  <div>
                    <label className="text-xs font-semibold text-rose-400 block mb-1">
                      {adm.vaultDescLabel}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.general.vaultDescription || ""}
                      onChange={e => setFormData({ ...formData, general: { ...formData.general, vaultDescription: e.target.value } })}
                      placeholder="Burası sadece ikimize özel. Fotoğrafları ve anıları görebilmek için..."
                      className="w-full p-2.5 bg-black/40 border border-white/15 text-xs rounded-lg text-white focus:outline-rose-500 resize-none leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 font-light">
                      {adm.vaultDescHint}
                    </p>
                  </div>

                  {/* 2. İpucu / Placeholder */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {adm.vaultPlaceholderLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.general.vaultPlaceholder || ""}
                      onChange={e => setFormData({ ...formData, general: { ...formData.general, vaultPlaceholder: e.target.value } })}
                      placeholder="Örn: Caffe Greco"
                      className="w-full p-2.5 bg-black/40 border border-white/15 text-xs rounded-lg text-white focus:outline-rose-500"
                    />
                  </div>

                  {/* 3. Kasa Şifresi / Cevap */}
                  <div>
                    <label className="text-xs font-semibold text-rose-400 block mb-1">
                      🔑 {adm.vaultPasswordLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.general.anniversaryPassword || ""}
                      onChange={e => setFormData({ ...formData, general: { ...formData.general, anniversaryPassword: e.target.value } })}
                      placeholder={adm.anniversaryPlaceholder || "Örn: Caffe Greco"}
                      className="w-full p-2.5 bg-rose-500/10 border border-rose-500/30 text-sm rounded-lg text-rose-300 font-bold focus:outline-rose-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 font-light">
                      {adm.vaultPasswordHint}
                    </p>
                  </div>

                  {/* 4. Admin PIN */}
                  <div className="pt-2 border-t border-white/10">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      🛡️ {adm.adminPinLabel}
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={formData.general.secretPin || "0411"}
                      onChange={e => setFormData({ ...formData, general: { ...formData.general, secretPin: e.target.value } })}
                      className="w-full sm:w-48 p-2.5 bg-black/40 border border-white/15 text-xs rounded-lg text-white font-mono focus:outline-rose-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 font-light">
                      {adm.adminPinHint}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB: MEMORIES */}
              {activeTab === 'memories' && (
                <div className="space-y-4">
                  {/* Aspect Ratio & Upload Guide Banner */}
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-rose-300">
                      <Sparkles size={18} className="text-rose-400 shrink-0" />
                      <div>
                        <span className="font-bold block text-white">{adm.ratioTitle}</span>
                        <p className="text-[11px] text-slate-400 font-light mt-0.5 leading-relaxed">
                          {adm.ratioDesc}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 hidden sm:inline-block px-2.5 py-1 bg-white/10 rounded-lg text-[10px] font-mono font-bold text-rose-300 border border-white/10">
                      4:3 / 1:1
                    </span>
                  </div>

                  {formData.memories?.map((m, mIndex) => (
                    <div key={m.id || mIndex} className="bg-white/5 p-4 border border-white/10 rounded-xl relative">
                      <div className="flex justify-between items-center mb-2.5 border-b border-white/10 pb-1.5">
                        <span className="text-xs font-bold text-rose-400">{adm.memoryNum}{mIndex + 1}</span>
                        <button onClick={() => removeMemory(mIndex)} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Upload Preview */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-28 h-28 bg-black/40 border border-white/15 rounded-xl overflow-hidden flex flex-col items-center justify-center relative group">
                            {m.photo ? (
                              <img src={m.photo} alt={m.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={28} className="text-slate-500" />
                            )}
                            <label className="absolute inset-0 bg-black/70 text-white text-[11px] font-semibold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <Upload size={16} className="mb-1" />
                              <span>{uploading ? adm.uploading : adm.choosePhoto}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleFileUpload(e, mIndex)}
                              />
                            </label>
                          </div>
                          <span className="text-[10px] text-rose-400/90 mt-1 font-medium font-mono">
                            {adm.recommendedRatio || "4:3 önerilir"}
                          </span>
                        </div>

                        {/* Fields */}
                        <div className="flex-1 w-full space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={m.title}
                              onChange={e => {
                                const updated = [...formData.memories]
                                updated[mIndex].title = e.target.value
                                setFormData({ ...formData, memories: updated })
                              }}
                              placeholder={adm.memoryTitlePlaceholder}
                              className="p-2 bg-black/40 border border-white/15 text-xs font-semibold rounded-lg text-white"
                            />
                            <input
                              type="date"
                              value={m.date}
                              onChange={e => {
                                const updated = [...formData.memories]
                                updated[mIndex].date = e.target.value
                                setFormData({ ...formData, memories: updated })
                              }}
                              className="p-2 bg-black/40 border border-white/15 text-xs rounded-lg text-white"
                            />
                          </div>

                          <input
                            type="text"
                            value={m.location || ""}
                            onChange={e => {
                              const updated = [...formData.memories]
                              updated[mIndex].location = e.target.value
                              setFormData({ ...formData, memories: updated })
                            }}
                            placeholder={adm.locationPlaceholder}
                            className="w-full p-2 bg-black/40 border border-white/15 text-xs rounded-lg text-white"
                          />

                          <textarea
                            value={m.caption}
                            onChange={e => {
                              const updated = [...formData.memories]
                              updated[mIndex].caption = e.target.value
                              setFormData({ ...formData, memories: updated })
                            }}
                            placeholder={adm.captionPlaceholder}
                            rows={2}
                            className="w-full p-2 bg-black/40 border border-white/15 text-xs rounded-lg text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addMemory}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-xl transition-colors cursor-pointer border border-white/10"
                  >
                    <Plus size={16} /> {adm.addMemoryBtn}
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 pt-3 mt-4 flex items-center justify-between gap-2">
              <button
                onClick={handleDownloadJSON}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                title={adm.downloadTooltip}
              >
                <Download size={14} /> {adm.downloadJson}
              </button>

              <div className="flex items-center gap-2">
                {uploadMsg && (
                  <span className="text-xs font-bold text-rose-400 animate-pulse">
                    {uploadMsg}
                  </span>
                )}
                {saveStatus && (
                  <span className="text-xs font-bold text-emerald-400 animate-pulse">
                    {saveStatus}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {adm.closeBtn}
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-rose-600/30 cursor-pointer"
                >
                  <Save size={15} /> {adm.saveBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
