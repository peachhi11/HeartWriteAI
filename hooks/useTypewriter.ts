"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TypewriterOptions = {
  onComplete?: () => void;
  speedMs?: number;
};

export function useTypewriter(
  fullText: string,
  { onComplete, speedMs = 18 }: TypewriterOptions = {},
) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const targetTextRef = useRef(fullText);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedTargetRef = useRef("");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishIfComplete = useCallback(() => {
    if (
      targetTextRef.current &&
      completedTargetRef.current !== targetTextRef.current
    ) {
      completedTargetRef.current = targetTextRef.current;
      onCompleteRef.current?.();
    }
  }, []);

  useEffect(() => {
    targetTextRef.current = fullText;

    if (!fullText) {
      clearTimer();
      return;
    }

    if (indexRef.current >= fullText.length || timerRef.current) {
      return clearTimer;
    }

    setIsTyping(true);
    timerRef.current = setTimeout(function typeNextCharacter() {
      if (indexRef.current >= targetTextRef.current.length) {
        timerRef.current = null;
        setIsTyping(false);
        finishIfComplete();
        return;
      }

      setDisplayedText(targetTextRef.current.slice(0, indexRef.current + 1));
      indexRef.current += 1;
      timerRef.current = setTimeout(typeNextCharacter, speedMs);
    }, speedMs);

    return clearTimer;
  }, [clearTimer, finishIfComplete, fullText, speedMs]);

  const forceSkipTypewriter = useCallback(() => {
    if (!isTyping) {
      return;
    }

    clearTimer();
    indexRef.current = targetTextRef.current.length;
    setDisplayedText(targetTextRef.current);
    setIsTyping(false);
    finishIfComplete();
  }, [clearTimer, finishIfComplete, isTyping]);

  return { displayedText, forceSkipTypewriter, isTyping };
}
