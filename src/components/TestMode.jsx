import { useEffect, useMemo, useState } from 'react'

function getRandomInt(max){
  return Math.floor(Math.random()*max)
}

function pickOptions(words, correct, n=4){
  const others = words.filter(w=>w.id!==correct.id)
  const shuffled = [...others].sort(()=>Math.random()-0.5)
  const options = shuffled.slice(0, n-1).map(w=>w.translation)
  options.push(correct.translation)
  return options.sort(()=>Math.random()-0.5)
}

export default function TestMode({ words, type, onSpeak, onAnswer }){
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [answered, setAnswered] = useState(null) // true/false/null

  useEffect(()=>{
    setIndex(0); setInput(''); setAnswered(null)
  }, [type, words])

  const current = words[index]
  if(!words.length) return <div className="p-6 text-slate-300">Нет слов для теста.</div>

  function submitAnswer(value){
    const ok = value.trim().toLowerCase()===current.translation.trim().toLowerCase() || value===true
    setAnswered(ok)
    onAnswer(current, ok)
  }

  function next(){
    setAnswered(null); setInput('')
    if(index<words.length-1) setIndex(index+1)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="text-slate-300">Вопрос {index+1} из {words.length}</div>
      {type==='choice' && (
        <div>
          <div className="text-white text-2xl font-semibold mb-3">{current.word}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pickOptions(words, current).map((opt,i)=> (
              <button key={i} onClick={()=>submitAnswer(opt)} className="px-3 py-2 text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200">
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {type==='input' && (
        <div>
          <div className="text-white text-2xl font-semibold mb-3">{current.word}</div>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') submitAnswer(input) }} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white" placeholder="Введите перевод"/>
          <div className="mt-2">
            <button onClick={()=>submitAnswer(input)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Ответить</button>
          </div>
        </div>
      )}
      {type==='speak' && (
        <div>
          <div className="text-white text-2xl font-semibold mb-3">{current.word}</div>
          <div className="text-slate-300 mb-2">Произнесите слово и проверьте себя, затем отметьте результат.</div>
          <div className="flex gap-2">
            <button onClick={()=>onSpeak(current.word)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700">Прослушать</button>
            <button onClick={()=>submitAnswer(true)} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded">Получилось</button>
            <button onClick={()=>submitAnswer(false)} className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded">Сложно</button>
          </div>
        </div>
      )}
      {answered!==null && (
        <div className={`p-3 rounded border ${answered? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}>
          {answered ? 'Верно!' : `Неверно. Правильный ответ: ${current.translation}`}
          <div className="mt-2">
            <button onClick={next} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700">Далее</button>
          </div>
        </div>
      )}
    </div>
  )
}
