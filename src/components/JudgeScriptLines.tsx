type JudgeScriptLine = {
  zh: string;
  en?: string;
};

type Props = {
  lines: JudgeScriptLine[];
};

function speakChinese(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 1;
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
  if (zhVoice) utterance.voice = zhVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function JudgeScriptLines({ lines }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      {lines.map((line, index) => (
        <div key={`${line.zh}-${index}`} className="leading-relaxed">
          <div className="flex items-center gap-2">
            <span>{line.zh}</span>
            <button
              type="button"
              className="px-1.5 py-0.5 rounded-md border border-[#6366f1] text-xs text-[#a5b4fc] hover:bg-[#312e81] transition-colors"
              aria-label={`朗读：${line.zh}`}
              title="朗读中文"
              onClick={() => speakChinese(line.zh)}
            >
              🔊
            </button>
          </div>
          {line.en && (
            <div className="text-xs text-[var(--color-moon-dim)] mt-0.5">{line.en}</div>
          )}
        </div>
      ))}
    </div>
  );
}
