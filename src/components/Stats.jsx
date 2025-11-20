export default function Stats({ stats }){
  const accuracy = stats.totalAnswers ? Math.round(100*stats.correctAnswers/stats.totalAnswers) : 0
  const studyMinutes = Math.floor((stats.totalStudySeconds||0)/60)
  return (
    <div className="p-4 space-y-3">
      <h3 className="text-lg font-semibold text-white">Статистика обучения</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-800 border border-slate-700 rounded">
          <div className="text-slate-400 text-sm">Сессии</div>
          <div className="text-white text-2xl font-bold">{stats.sessions||0}</div>
        </div>
        <div className="p-4 bg-slate-800 border border-slate-700 rounded">
          <div className="text-slate-400 text-sm">Ответов</div>
          <div className="text-white text-2xl font-bold">{stats.totalAnswers||0}</div>
        </div>
        <div className="p-4 bg-slate-800 border border-slate-700 rounded">
          <div className="text-slate-400 text-sm">Точность</div>
          <div className="text-white text-2xl font-bold">{accuracy}%</div>
        </div>
        <div className="p-4 bg-slate-800 border border-slate-700 rounded">
          <div className="text-slate-400 text-sm">Время, мин</div>
          <div className="text-white text-2xl font-bold">{studyMinutes}</div>
        </div>
      </div>
    </div>
  )
}
