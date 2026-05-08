import type { ReactNode } from 'react';

type Props = {
  zh: ReactNode;
  en: ReactNode;
  align?: 'left' | 'center';
  small?: boolean;
};

export default function Bilingual({
  zh,
  en,
  align = 'left',
  small = false,
}: Props) {
  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      <div className={small ? 'text-sm font-semibold text-[var(--color-moon-bright)]' : 'text-base text-[var(--color-moon-bright)]'}>
        {zh}
      </div>
      <div className={`mt-0.5 text-[var(--color-moon-dim)] leading-tight ${small ? 'text-[11px]' : 'text-xs'}`}>
        {en}
      </div>
    </div>
  );
}
