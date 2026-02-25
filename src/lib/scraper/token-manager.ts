// ============================================
// 네이버 부동산 토큰 관리 모듈
// Puppeteer로 네이버 부동산 접속 → 토큰 획득
// ============================================

import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';
import prisma from '../db/prisma';

const NAVER_LAND_URL = 'https://new.land.naver.com';
const COMPLEXES_URL = `${NAVER_LAND_URL}/complexes`;

export interface NaverToken {
  accessToken: string;
  expiresAt: Date;
  cookies?: string;  // 쿠키 문자열
}

export class TokenManager {
  private browser: Browser | null = null;
  private currentToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private currentCookies: string | null = null;

  /**
   * Puppeteer 브라우저 초기화
   */
  async initBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-blink-features=AutomationControlled',
        ],
      });
    }
    return this.browser;
  }

  /**
   * 브라우저 종료
   */
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * DB에서 유효한 토큰 조회
   */
  private async getValidTokenFromDb(): Promise<string | null> {
    const tokenRecord = await prisma.naverToken.findFirst({
      where: {
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tokenRecord?.accessToken || null;
  }

  /**
   * 토큰을 DB에 저장
   */
  private async saveTokenToDb(accessToken: string, expiresAt: Date, cookies?: string): Promise<void> {
    // 기존 토큰 삭제 (선택 - 여러 토큰을 유지하려면 이 부분 수정)
    await prisma.naverToken.deleteMany({});

    await prisma.naverToken.create({
      data: {
        accessToken,
        expiresAt,
        ...(cookies && { cookies }),
      },
    });
  }

  /**
   * 네이버 부동산에서 새 토큰 발급
   *
   * 방법: 실제 사용자처럼 브라우징 후 클릭으로 토큰 획득
   */
  async fetchNewToken(): Promise<string> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    // 봇 감지 회피 - User-Agent 설정
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    // 봇 감지 회피
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      Object.defineProperty(navigator, 'languages', {
        get: () => ['ko-KR', 'ko', 'en-US', 'en'],
      });
      (window as any).chrome = {
        runtime: {},
      };
    });

    let foundToken: string | null = null;

    // request 이벤트로 Authorization 헤더 캡처
    page.on('request', (request) => {
      const url = request.url();
      const headers = request.headers();

      if (url.includes('new.land.naver.com/api/') && headers['authorization']) {
        const authHeader = headers['authorization'] as string;
        const match = authHeader.match(/Bearer\s+(.+)/);
        if (match && match[1] && !foundToken) {
          foundToken = match[1];
          console.log('토큰 획득 성공:', foundToken.substring(0, 30) + '...');
        }
      }
    });

    try {
      console.log('네이버 부동산 접속 중...');
      await page.goto(NAVER_LAND_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      // 페이지가 로딩될 때까지 대기
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 1. complexes 페이지로 이동
      console.log('complexes 페이지 이동 중...');
      await page.goto(COMPLEXES_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. 페이지 내에서 아무 매물 링크나 버튼 클릭 (API 호출 유도)
      console.log('매물 링크 클릭 중...');

      // 페이지에서 직접 fetch 호출로 API 요청 유도
      const clicked = await page.evaluate(() => {
        // 직접 API 호출 시도
        return fetch('https://new.land.naver.com/api/articles?cortarNo=4111513200&realEstateType=TJ:SMS:SG&tradeType=A1:B1:B2&page=1', {
          method: 'GET',
          credentials: 'include',
        }).then(res => res.ok).catch(() => false);
      });

      console.log('클릭 완료, 토큰 대기 중...');

      // 토큰을 찾을 때까지 대기
      const maxWait = 10; // 10초
      for (let i = 0; i < maxWait; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (foundToken) {
          break;
        }

        // 추가 클릭 시도
        await page.evaluate(() => {
          const buttons = document.querySelectorAll('button, a');
          if (buttons.length > 1) {
            (buttons[1] as HTMLElement).click();
          }
        });
      }

      if (!foundToken) {
        throw new Error('토큰 획득 실패');
      }

      // 쿠키 추출
      const cookies = await page.cookies();
      const cookieString = cookies
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

      const expiresAt = new Date(Date.now() + 23 * 60 * 60 * 1000);
      await this.saveTokenToDb(foundToken, expiresAt, cookieString);

      this.currentToken = foundToken;
      this.tokenExpiry = expiresAt;
      this.currentCookies = cookieString;

      return foundToken;
    } finally {
      await page.close();
    }
  }

  /**
   * 유효한 토큰 반환
   * 1. 메모리에 있는 유효한 토큰 반환
   * 2. DB에 있는 유효한 토큰 반환
   * 3. 새로 토큰 발급
   */
  async getToken(): Promise<{ token: string; cookies?: string }> {
    const now = new Date();

    // 메모리에 있는 토큰 확인
    if (this.currentToken && this.tokenExpiry && this.tokenExpiry > now) {
      return { token: this.currentToken, cookies: this.currentCookies || undefined };
    }

    // DB에서 유효한 토큰 확인
    const tokenRecord = await prisma.naverToken.findFirst({
      where: {
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (tokenRecord) {
      this.currentToken = tokenRecord.accessToken;
      this.tokenExpiry = tokenRecord.expiresAt;
      this.currentCookies = tokenRecord.cookies || null;
      return { token: tokenRecord.accessToken, cookies: tokenRecord.cookies || undefined };
    }

    // 새 토큰 발급
    const newToken = await this.fetchNewToken();
    return { token: newToken, cookies: this.currentCookies || undefined };
  }

  /**
   * 토큰만 반환 (호환성용)
   */
  async getTokenOnly(): Promise<string> {
    const result = await this.getToken();
    return result.token;
  }

  /**
   * 토큰 갱신 (강제 새로 발급)
   */
  async refreshToken(): Promise<string> {
    return this.fetchNewToken();
  }

  /**
   * 토큰 만료 여부 확인
   */
  isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return new Date() >= this.tokenExpiry;
  }
}

// 싱글톤 인스턴스
const tokenManager = new TokenManager();

export default tokenManager;
