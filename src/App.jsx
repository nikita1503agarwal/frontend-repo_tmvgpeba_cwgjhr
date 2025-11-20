import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import WordForm from './components/WordForm'
import WordList from './components/WordList'
import Flashcards from './components/Flashcards'
import TestMode from './components/TestMode'
import Stats from './components/Stats'
import SettingsPanel from './components/SettingsPanel'
import { loadWords, saveWords, loadStats, saveStats, loadSettings, saveSettings, generateId } from './utils/storage'

const modes = {
  list: 'Список',
  flash: 'Карточки',
  testChoice: 'Тест: выбор',
  testInput: 'Тест: ввод',
  testSpeak: 'Тест: произношение'
}

function useTimer(active){
  const startRef = useRef(null)
  const [acc, setAcc] = useState(0)
  useEffect(()=>{
    let t
    if(active){
      startRef.current = Date.now()
      t = setInterval(()=> setAcc(Date.now()-startRef.current), 1000)
    }
    return ()=>{ if(t) clearInterval(t) }
  }, [active])
  return Math.floor(acc/1000)
}

function speak(text, settings){
  if(!('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = settings.ttsRate || 1
  utter.pitch = settings.ttsPitch || 1
  utter.lang = 'en-US'
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utter)
}

export default function App(){
  const [words, setWords] = useState(loadWords())
  const [stats, setStats] = useState(loadStats())
  const [settings, setSettings] = useState(loadSettings())
  const [mode, setMode] = useState('list')
  const [showForm, setShowForm] = useState(false)
  const [editWord, setEditWord] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [filter, setFilter] = useState({ q: '', category: 'Все', level: 'Все' })

  const activeSeconds = useTimer(mode!=='list')

  useEffect(()=>{ saveWords(words) }, [words])
  useEffect(()=>{ saveSettings(settings) }, [settings])
  useEffect(()=>{
    const id = setInterval(()=>{
      setStats(s => { const next = { ...s, totalStudySeconds: (s.totalStudySeconds||0) + (mode==='list'?0:1) }; saveStats(next); return next })
    }, 1000)
    return ()=> clearInterval(id)
  }, [mode])

  function addWord(data){
    const item = { ...data, id: generateId(), examples: data.examples||[], correct: 0, wrong: 0 }
    setWords([item, ...words])
    setShowForm(false)
  }

  function updateWord(data){
    setWords(words.map(w=> w.id===data.id ? { ...w, ...data } : w))
    setShowForm(false); setEditWord(null)
  }

  function removeWord(id){
    setWords(words.filter(w=> w.id!==id))
    setSelectedIds(selectedIds.filter(x=>x!==id))
  }

  function onSpeak(text){ speak(text, settings) }

  function onAnswer(word, ok){
    setWords(ws => ws.map(w=> w.id===word.id ? { ...w, correct: w.correct + (ok?1:0), wrong: w.wrong + (ok?0:1), level: ok ? (w.level==='new' ? 'learning' : w.level==='learning' ? 'good' : 'review') : 'learning', nextReviewAt: Date.now() + (ok? 1000*60*60*24 : 1000*60*10) } : w))
    setStats(s => { const next = { ...s, totalAnswers: (s.totalAnswers||0)+1, correctAnswers: (s.correctAnswers||0) + (ok?1:0) }; saveStats(next); return next })
  }

  const categories = useMemo(()=>['Все', ...Array.from(new Set(words.map(w=>w.category||'Общее')))], [words])

  const filtered = useMemo(()=>{
    return words.filter(w=>
      (filter.category==='Все' || (w.category||'Общее')===filter.category) &&
      (filter.level==='Все' || w.level===filter.level) &&
      (filter.q==='' || w.word.toLowerCase().includes(filter.q.toLowerCase()) || w.translation.toLowerCase().includes(filter.q.toLowerCase()))
    )
  }, [words, filter])

  function toggleSelect(id){
    setSelectedIds(ids => ids.includes(id) ? ids.filter(x=>x!==id) : [...ids, id])
  }

  function startSession(kind){
    if(selectedIds.length){
      setMode(kind)
    } else if (filtered.length) {
      setMode(kind)
    }
    setStats(s=> ({ ...s, sessions: (s.sessions||0)+1 }))
  }

  const studySet = selectedIds.length ? words.filter(w=> selectedIds.includes(w.id)) : filtered

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Header onAddClick={()=>{ setEditWord(null); setShowForm(true) }} onOpenStats={()=>setMode('stats')} onOpenSettings={()=>setMode('settings')}/>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
            <input value={filter.q} onChange={e=>setFilter({ ...filter, q: e.target.value })} placeholder="Поиск по слову или переводу" className="w-full bg-transparent outline-none text-slate-200"/>
          </div>
          <select value={filter.category} onChange={e=>setFilter({ ...filter, category: e.target.value })} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filter.level} onChange={e=>setFilter({ ...filter, level: e.target.value })} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
            {['Все','new','learning','good','review'].map(l=> <option key={l} value={l}>{l==='Все'?'Все статусы': l==='new'?'Новое': l==='learning'?'Изучаю': l==='good'?'Знаю хорошо':'Помню'}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={()=>startSession('flash')} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded">Карточки</button>
          <button onClick={()=>startSession('testChoice')} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded">Тест: выбор</button>
          <button onClick={()=>startSession('testInput')} className="px-3 py-2 bg-violet-600 hover:bg-violet-500 rounded">Тест: ввод</button>
          <button onClick={()=>startSession('testSpeak')} className="px-3 py-2 bg-amber-600 hover:bg-amber-500 rounded">Произношение</button>
          <button onClick={()=>{ setSelectedIds([]); setMode('list') }} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded">Список</button>
        </div>

        {mode==='list' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <WordList words={filtered} onSpeak={onSpeak} onEdit={(w)=>{ setEditWord(w); setShowForm(true) }} onDelete={removeWord} onToggleSelect={toggleSelect} selectedIds={selectedIds}/>
          </div>
        )}

        {mode==='flash' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <Flashcards items={studySet} onSpeak={onSpeak} onResult={onAnswer}/>
          </div>
        )}

        {mode.startsWith('test') && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <TestMode type={mode==='testChoice'?'choice': mode==='testInput'?'input':'speak'} words={studySet} onSpeak={onSpeak} onAnswer={onAnswer}/>
          </div>
        )}

        {mode==='stats' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <Stats stats={stats}/>
          </div>
        )}

        {mode==='settings' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <SettingsPanel settings={settings} onChange={setSettings}/>
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-xl">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800">
              <div className="text-white font-semibold">{editWord? 'Редактирование' : 'Новое слово'}</div>
              <button onClick={()=>{ setShowForm(false); setEditWord(null) }} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <WordForm initial={editWord} onSave={(data)=> editWord? updateWord(data) : addWord(data)} onCancel={()=>{ setShowForm(false); setEditWord(null) }}/>
          </div>
        </div>
      )}

      <footer className="text-center text-slate-500 text-xs py-6">Локальное хранение • Озвучка через браузер • Русский интерфейс</footer>
    </div>
  )
}
