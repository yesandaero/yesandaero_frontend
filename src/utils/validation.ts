/**
 * 폼 입력 검증 헬퍼.
 * 각 함수는 문제가 있으면 에러 메시지(string)를, 통과하면 undefined를 반환한다.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 숫자와 하이픈만, 9~13자 (예: 042-123-4567, 01012345678)
export const PHONE_RE = /^[0-9-]{9,13}$/;

/** 라벨의 마지막 글자에 받침이 있는지 (한글 음절만 판단) */
function hasBatchim(word: string): boolean {
  const w = word.trim();
  if (!w) return false;
  const code = w.charCodeAt(w.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}
/** 을/를 조사 선택 */
function eulReul(word: string): string {
  return hasBatchim(word) ? '을' : '를';
}
/** 은/는 조사 선택 */
function eunNeun(word: string): string {
  return hasBatchim(word) ? '은' : '는';
}

export function required(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label}${eulReul(label)} 입력해주세요`;
  return undefined;
}

export function email(value: string): string | undefined {
  if (!value.trim()) return '이메일을 입력해주세요';
  if (!EMAIL_RE.test(value.trim())) return '이메일 형식이 올바르지 않아요 (예: owner@example.com)';
  return undefined;
}

export function password(value: string, min = 8): string | undefined {
  if (!value) return '비밀번호를 입력해주세요';
  if (value.length < min) return `비밀번호는 ${min}자 이상이어야 해요`;
  return undefined;
}

export function phone(value: string): string | undefined {
  if (!value.trim()) return '전화번호를 입력해주세요';
  if (!PHONE_RE.test(value.trim())) return '전화번호 형식이 올바르지 않아요 (숫자·하이픈만)';
  return undefined;
}

/** 양수(0 초과) 정수/실수 */
export function positiveNumber(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label}${eulReul(label)} 입력해주세요`;
  const n = Number(value);
  if (Number.isNaN(n)) return `${label}${eunNeun(label)} 숫자여야 해요`;
  if (n <= 0) return `${label}${eunNeun(label)} 0보다 커야 해요`;
  return undefined;
}

/** 0 이상 정수/실수 */
export function nonNegativeNumber(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label}${eulReul(label)} 입력해주세요`;
  const n = Number(value);
  if (Number.isNaN(n)) return `${label}${eunNeun(label)} 숫자여야 해요`;
  if (n < 0) return `${label}${eunNeun(label)} 0 이상이어야 해요`;
  return undefined;
}

/** 지정 범위(min~max)의 숫자 */
export function numberInRange(value: string, label: string, min: number, max: number): string | undefined {
  if (!value.trim()) return `${label}${eulReul(label)} 입력해주세요`;
  const n = Number(value);
  if (Number.isNaN(n)) return `${label}${eunNeun(label)} 숫자여야 해요`;
  if (n < min || n > max) return `${label}${eunNeun(label)} ${min}~${max} 사이여야 해요`;
  return undefined;
}

/** 양의 정수 */
export function positiveInteger(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label}${eulReul(label)} 입력해주세요`;
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return `${label}${eunNeun(label)} 1 이상의 정수여야 해요`;
  return undefined;
}

/** 에러 객체에 유효한(비어있지 않은) 메시지가 하나라도 있으면 true */
export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
