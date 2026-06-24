'use client';

import { useEffect } from 'react';

/**
 * Google blocks OAuth sign-in from embedded WebViews (it checks the user
 * agent and rejects requests from in-app browsers like KakaoTalk's). Links
 * shared via KakaoTalk open inside its own in-app browser by default, which
 * breaks "Google로 로그인" entirely — so on any page opened that way, we
 * immediately hand off to the device's real browser via KakaoTalk's own
 * external-open scheme. The relaunched page has a normal user agent, so
 * this never loops.
 */
export function useKakaoInAppRedirect() {
  useEffect(() => {
    if (!/KAKAOTALK/i.test(navigator.userAgent)) return;
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(window.location.href)}`;
  }, []);
}
