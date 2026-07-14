import type { ReactNode } from 'react';

/**
 * 폼 필드 래퍼. 라벨 + 입력 컨트롤(children) + 에러/힌트 메시지를 함께 렌더한다.
 * error가 있으면 .invalid 클래스가 붙어 입력창이 빨갛게 표시된다.
 */
export function Field({
  label,
  error,
  hint,
  children,
}: {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`field ${error ? 'invalid' : ''}`}>
      {label != null && <label>{label}</label>}
      {children}
      {error ? (
        <div className="field-err">{error}</div>
      ) : hint != null ? (
        <div className="field-hint">{hint}</div>
      ) : null}
    </div>
  );
}
