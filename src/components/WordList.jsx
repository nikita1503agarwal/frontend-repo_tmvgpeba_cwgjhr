import { Volume2, Edit, Trash2, BadgeCheck } from 'lucide-react'

export default function WordList({ words, onSpeak, onEdit, onDelete, onToggleSelect, selectedIds }) {
  if (!words.length) {
    return (
      <div className="p-6 text-slate-300">Пока нет слов. Нажмите «Добавить», чтобы начать.</div>
    )
  }

  return (
    <div className="divide-y divide-slate-800">
      {words.map((w) => (
        <div key={w.id} className="p-4 grid grid-cols-12 gap-3 items-center hover:bg-slate-800/40">
          <div className="col-span-1">
            <input type="checkbox" checked={selectedIds.includes(w.id)} onChange={() => onToggleSelect(w.id)} className="accent-blue-500"/>
          </div>
          <div className="col-span-5">
            <div className="flex items-center gap-2">
              <div className="text-white text-lg font-semibold">{w.word}</div>
              {w.transcription && <div className="text-slate-400 text-sm">{w.transcription}</div>}
              <button onClick={() => onSpeak(w.word)} className="p-1 rounded hover:bg-slate-700 text-slate-300" title="Прослушать">
                <Volume2 className="w-4 h-4"/>
              </button>
            </div>
            <div className="text-slate-300">{w.translation}</div>
            {!!w.examples?.length && (
              <div className="text-xs text-slate-400 mt-1 line-clamp-1">{w.examples[0]}</div>
            )}
          </div>
          <div className="col-span-3">
            <div className="text-sm">
              <span className="px-2 py-1 rounded bg-slate-700 text-slate-200">{w.category || 'Общее'}</span>
            </div>
          </div>
          <div className="col-span-3 flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded border border-slate-700 text-slate-300">
              {w.level === 'new' && 'Новое'}
              {w.level === 'learning' && 'Изучаю'}
              {w.level === 'good' && 'Знаю хорошо'}
              {w.level === 'review' && 'Помню'}
            </span>
            <span className="text-xs text-slate-400">✓{w.correct} • ✗{w.wrong}</span>
          </div>
          <div className="col-span-12 md:col-span-0 flex md:block gap-2 md:gap-0">
            <button onClick={() => onEdit(w)} className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded">Ред.</button>
            <button onClick={() => onDelete(w.id)} className="px-2 py-1 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded">Удалить</button>
          </div>
        </div>
      ))}
    </div>
  )
}
