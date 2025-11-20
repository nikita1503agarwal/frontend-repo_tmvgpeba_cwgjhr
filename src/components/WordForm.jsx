import { useState, useEffect } from 'react'

const levels = [
  { value: 'new', label: 'Новое' },
  { value: 'learning', label: 'Изучаю' },
  { value: 'good', label: 'Знаю хорошо' },
  { value: 'review', label: 'Помню' },
]

export default function WordForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    id: null,
    word: '',
    translation: '',
    transcription: '',
    examples: '',
    category: 'Общее',
    level: 'new',
    nextReviewAt: null,
    createdAt: Date.now(),
    correct: 0,
    wrong: 0,
  })

  useEffect(() => {
    if (initial) setForm(initial)
  }, [initial])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.word.trim() || !form.translation.trim()) return
    onSave({ ...form, examples: form.examples.split('\n').filter(Boolean) })
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white mb-3">{form.id ? 'Редактировать слово' : 'Добавить новое слово'}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Слово</label>
            <input name="word" value={form.word} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="например, achieve"/>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Перевод</label>
            <input name="translation" value={form.translation} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="например, достигать"/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Транскрипция</label>
            <input name="transcription" value={form.transcription} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="/əˈtʃiːv/"/>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Категория</label>
            <input name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="Бизнес, Путешествия..."/>
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Примеры использования (по одному на строку)</label>
          <textarea name="examples" value={Array.isArray(form.examples) ? form.examples.join('\n') : form.examples} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="I want to achieve my goals.\nShe achieved success."/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Статус</label>
            <select name="level" value={form.level} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
              {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Сохранить</button>
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Отмена</button>
          </div>
        </div>
      </form>
    </div>
  )
}
