import { useEffect, useMemo, useState } from 'react'

function shuffle(arr){
  return [...arr].sort(()=>Math.random()-0.5)
}

export default function Flashcards({ items, onSpeak, onResult }){
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [order, setOrder] = useState([])

  useEffect(()=>{
    const idxs = items.map((_,i)=>i)
    setOrder(shuffle(idxs))
    setIndex(0)
    setFlipped(false)
  }, [items])

  const current = items[order[index]]

  function next(res){
    onResult(current, res)
    setFlipped(false)
    if(index < items.length-1) setIndex(index+1)
  }

  if(!items.length) return <div className="p-6 text-slate-300">Нет слов для карточек.</div>
  if(!current) return null

  return (
    <div className="p-6">
      <div className="text-slate-300 mb-4">Карточка {index+1} из {items.length}</div>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 cursor-pointer select-none" onClick={()=>setFlipped(!flipped)}>
        {!flipped ? (
          <div>
            <div className="text-3xl text-white font-bold mb-2">{current.word}</div>
            {current.transcription && <div className="text-slate-400 mb-2">{current.transcription}</div>}
            <button onClick={(e)=>{e.stopPropagation(); onSpeak(current.word)}} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded">Произнести</button>
          </div>
        ) : (
          <div>
            <div className="text-2xl text-white font-semibold mb-2">{current.translation}</div>
            {!!current.examples?.length && (
              <ul className="list-disc pl-5 text-slate-300 space-y-1">
                {current.examples.map((ex,i)=>(<li key={i}>{ex}</li>))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={()=>next(false)} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded">Было сложно</button>
        <button onClick={()=>next(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded">Легко</button>
      </div>
    </div>
  )
}
