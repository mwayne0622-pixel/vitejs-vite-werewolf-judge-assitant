import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  selectablePlayers: Player[];
  wolfTeamPlayers: Player[];
  draftHiddenWolfOwnerId: number | null;
  canGoNext: boolean;
  onSelectHiddenWolf: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightHiddenWolfScreen({
  selectablePlayers,
  wolfTeamPlayers,
  draftHiddenWolfOwnerId,
  canGoNext,
  onSelectHiddenWolf,
  onBack,
  onNext,
}: Props) {
  const wolfSeatList = wolfTeamPlayers.map((p) => `${p.seat}号`).join('、');
  const wolfSeatListEn = wolfTeamPlayers.map((p) => `Seat ${p.seat}`).join(', ');

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '隐狼请睁眼，确认你的隐狼身份。', en: 'Hidden Wolf, please open your eyes and confirm your identity.' },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-3">
          <Bilingual zh="从未认领狼人身份的玩家中选择隐狼" en="Select the Hidden Wolf from players who did not claim wolf identity" small />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftHiddenWolfOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => onSelectHiddenWolf(player.id)}
              />
            );
          })}
        </div>
      </div>

      {wolfTeamPlayers.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
          <JudgeScriptHeader />
          <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
            <JudgeScriptLines
              lines={[
                {
                  zh: `（低声）你的狼队友是：${wolfSeatList}。他们不知道你是隐狼。`,
                  en: `(Quietly) Your wolf teammates are: ${wolfSeatListEn}. They do not know you are the Hidden Wolf.`,
                  noTts: true,
                },
              ]}
            />
          </div>
        </div>
      )}

      <div className="mt-4 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '隐狼请闭眼。', en: 'Hidden Wolf, please close your eyes.' },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="button"
          className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors"
          onClick={onBack}
        >
          <Bilingual zh="返回" en="Back" small />
        </button>
        <button
          type="button"
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canGoNext ? 'bg-[var(--color-blood)] text-white hover:brightness-110 shadow-[var(--shadow-glow-blood)]' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canGoNext}
          onClick={onNext}
        >
          <Bilingual zh="确认身份，下一步" en="Confirm & Next" small />
        </button>
      </div>
    </section>
  );
}
