/**
 * API Base URL 설정
 * - 프로덕션: 같은 서버에서 서빙되므로 빈 문자열 (상대 경로)
 * - 개발: Vite 프록시를 통해 API 서버로 전달
 */
export const API_BASE = import.meta.env.VITE_API_BASE || '';
