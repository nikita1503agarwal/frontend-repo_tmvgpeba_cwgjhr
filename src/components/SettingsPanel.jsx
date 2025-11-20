import { useState, useEffect } from 'react'

export default function SettingsPanel({ settings, onChange }){
  const [local, setLocal] = useState(settings)

  useEffect(()=>{ setLocal(settings) }, [settings])

  function update(field, value){
    const next = { ...local, [field]: value }
    setLocal(next)
    onChange(next)
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-white">Настройки</h3>
      <div className="space-y-2">
        <label className="block text-sm text-slate-300">Скорость озвучки: {local.ttsRate}</label>
        <input type="range" min="0.5" max="2" step="0.1" value={local.ttsRate} onChange={e=>update('ttsRate', parseFloat(e.target.value))} className="w-full"/>
      </div>
      <div className="space-y-2">
        <label className="block text-sm text-slate-300">Высота голоса: {local.ttsPitch}</label>
        <input type="range" min="0" max="2" step="0.1" value={local.ttsPitch} onChange={e=>update('ttsPitch', parseFloat(e.target.value))} className="w-full"/>
      </div>
      <div className="flex items-center gap-2">
        <input id="tr" type="checkbox" checked={local.showTranscription} onChange={e=>update('showTranscription', e.target.checked)} className="accent-blue-500"/>
        <label htmlFor="tr" className="text-slate-300">Показывать транскрипцию</label>
      </div>
    </div>
  )
}
