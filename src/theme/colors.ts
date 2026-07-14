/**
 * 디자인 색상 팔레트 (단일 소스).
 * CSS 변수(src/index.css :root)와 값이 1:1로 일치한다. JS에서 색이 필요하면 여기서 가져다 쓴다.
 */
export const colors = {
  primary50: "#FFFCF2",
  primary100: "#FFF7D6",
  primary200: "#FFF0AD",
  primary300: "#FFE680",
  primary400: "#FFD95A",
  primary500: "#F9C74F",
  primary600: "#F4B942",
  primary700: "#E9A825",
  primary800: "#D98F00",
  primary900: "#B87400",

  neutral0: "#FFFFFF",
  neutral50: "#F8F9FA",
  neutral100: "#F1F3F5",
  neutral200: "#E9ECEF",
  neutral300: "#DEE2E6",
  neutral400: "#CED4DA",
  neutral500: "#ADB5BD",
  neutral600: "#868E96",
  neutral700: "#495057",
  neutral800: "#343A40",
  neutral900: "#212529",
  neutral1000: "#000000",

  successGreen: "#2E7D52",
  warningAmber: "#F59E0B",
  errorRed: "#DC2626",
  infoBlue: "#FF8787",
} as const;

export type ColorsType = typeof colors;
