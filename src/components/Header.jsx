import { BookOpen, BarChart3, PlusCircle, Settings } from 'lucide-react'

export default function Header({ onAddClick, onOpenStats, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-white font-semibold leading-tight">Словарь+ Учебник</div>
            <div className="text-xs text-slate-400">Изучение слов • карточки • тесты</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenStats} className="px-3 py-2 text-sm text-slate-200 hover:text-white rounded-lg hover:bg-slate-800 border border-slate-800">
            <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4"/>Статистика</div>
          </button>
          <button onClick={onAddClick} className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg border border-blue-400/40">
            <div className="flex items-center gap-2"><PlusCircle className="w-4 h-4"/>Добавить</div>
          </button>
          <button onClick={onOpenSettings} className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 border border-slate-800">
            <Settings className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </header>
  )
}
