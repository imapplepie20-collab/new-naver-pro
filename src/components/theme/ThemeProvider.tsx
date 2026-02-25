import { useEffect } from 'react'
import { useThemeStore, ACCENT_COLORS } from '../../stores/themeStore'

/**
 * 테마 적용 함수
 */
const applyTheme = (
  mode: 'light' | 'dark' | 'system' | 'smart',
  accentColor: string,
  fontSize: 'small' | 'medium' | 'large',
  borderRadius: 'sharp' | 'medium' | 'rounded'
) => {
  const root = document.documentElement

  // 테마 모드 적용 (index.css에 정의된 클래스 기반)
  const effectiveMode = mode === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : mode

  root.classList.remove('dark', 'light', 'smart')
  root.classList.add(effectiveMode)

  // 강조 색상 적용
  const accentConfig = ACCENT_COLORS[accentColor as 'cyan' | 'indigo' | 'pink' | 'orange' | 'green' | 'red']
  root.style.setProperty('--hud-accent-primary', accentConfig.primary)
  root.style.setProperty('--hud-accent-info', accentConfig.info)
  root.style.setProperty('--hud-accent-warning', accentConfig.warning)
  root.style.setProperty('--hud-accent-danger', accentConfig.danger)
  root.style.setProperty('--hud-accent-success', accentConfig.success)

  // 강조 색상 RGB 값
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 255, 204'
  }
  root.style.setProperty('--hud-accent-primary-rgb', hexToRgb(accentConfig.primary))

  // 글자 크기 적용
  const fontSizes = { small: '14px', medium: '16px', large: '18px' }
  root.style.setProperty('--hud-base-font-size', fontSizes[fontSize])
  document.body.style.fontSize = fontSizes[fontSize]

  // 모서리 둥글기 적용
  const borderRadiuses = { sharp: '0px', medium: '8px', rounded: '16px' }
  root.style.setProperty('--hud-base-border-radius', borderRadiuses[borderRadius])

  // 동적 스타일 시트 업데이트
  let styleTag = document.getElementById('dynamic-theme-styles') as HTMLStyleElement
  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = 'dynamic-theme-styles'
    document.head.appendChild(styleTag)
  }

  styleTag.textContent = `
    .bg-hud-accent-primary { background-color: ${accentConfig.primary} !important; }
    .bg-hud-accent-info { background-color: ${accentConfig.info} !important; }
    .bg-hud-accent-warning { background-color: ${accentConfig.warning} !important; }
    .bg-hud-accent-danger { background-color: ${accentConfig.danger} !important; }
    .bg-hud-accent-success { background-color: ${accentConfig.success} !important; }
    .text-hud-accent-primary { color: ${accentConfig.primary} !important; }
    .text-hud-accent-info { color: ${accentConfig.info} !important; }
    .text-hud-accent-warning { color: ${accentConfig.warning} !important; }
    .text-hud-accent-danger { color: ${accentConfig.danger} !important; }
    .text-hud-accent-success { color: ${accentConfig.success} !important; }
    .border-hud-accent-primary { border-color: ${accentConfig.primary} !important; }
    .border-hud-accent-info { border-color: ${accentConfig.info} !important; }
    .border-hud-accent-warning { border-color: ${accentConfig.warning} !important; }
    .border-hud-accent-danger { border-color: ${accentConfig.danger} !important; }
    .border-hud-accent-success { border-color: ${accentConfig.success} !important; }
    .ring-hud-accent-primary { --tw-ring-color: ${accentConfig.primary} !important; }
    .peer:checked ~ .peer-checked\\:bg-hud-accent-primary,
    input[type="checkbox"]:checked ~ .peer-checked\\:bg-hud-accent-primary {
      background-color: ${accentConfig.primary} !important;
    }
  `
}

/**
 * ThemeProvider 컴포넌트
 * 테마 설정을 CSS 변수와 동적 스타일로 적용합니다.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { mode, accentColor, fontSize, borderRadius } = useThemeStore()

  // 테마 적용 - mode 등이 변경되면 즉시 재적용
  applyTheme(mode, accentColor, fontSize, borderRadius)

  // 테마 변경 감지 (useEffect로)
  useEffect(() => {
    applyTheme(mode, accentColor, fontSize, borderRadius)
  }, [mode, accentColor, fontSize, borderRadius])

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (mode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      applyTheme(mode, accentColor, fontSize, borderRadius)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode, accentColor, fontSize, borderRadius])

  return <>{children}</>
}
