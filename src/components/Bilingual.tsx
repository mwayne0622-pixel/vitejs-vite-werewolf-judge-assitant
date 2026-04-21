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
    <div style={{ textAlign: align }}>
      <div
        style={{
          fontSize: small ? 14 : undefined,
          fontWeight: small ? 600 : undefined,
        }}
      >
        {zh}
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: small ? 11 : 12,
          color: '#6b7280',
          lineHeight: 1.25,
        }}
      >
        {en}
      </div>
    </div>
  );
}
