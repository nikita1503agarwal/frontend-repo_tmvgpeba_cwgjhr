// Local storage helpers for the vocabulary app

const STORAGE_KEYS = {
  WORDS: 'vocab_words_v1',
  STATS: 'vocab_stats_v1',
  SETTINGS: 'vocab_settings_v1'
};

export function loadWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORDS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Ошибка загрузки слов:', e);
    return [];
  }
}

export function saveWords(words) {
  try {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
  } catch (e) {
    console.error('Ошибка сохранения слов:', e);
  }
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    return raw ? JSON.parse(raw) : { totalAnswers: 0, correctAnswers: 0, totalStudySeconds: 0, sessions: 0 };
  } catch (e) {
    return { totalAnswers: 0, correctAnswers: 0, totalStudySeconds: 0, sessions: 0 };
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Ошибка сохранения статистики:', e);
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : { ttsRate: 1, ttsPitch: 1, showTranscription: true };
  } catch (e) {
    return { ttsRate: 1, ttsPitch: 1, showTranscription: true };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Ошибка сохранения настроек:', e);
  }
}

export function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
