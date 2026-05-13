import Bilingual from './Bilingual';

export default function JudgeScriptHeader() {
  return (
    <div className="text-xs font-bold text-[#818cf8] mb-2 text-center flex items-center justify-center gap-1.5">
      <span aria-hidden="true" className="text-xl leading-none">⚖️</span>
      <Bilingual zh="法官宣读" en="Judge script" small />
    </div>
  );
}
