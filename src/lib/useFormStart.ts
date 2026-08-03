'use client';

import { useEffect, useRef } from 'react';
import { track } from './track';

/**
 * Fires one form_start event the first time a visitor puts anything into a
 * tool's form. ai_generate only tells us who finished; without this the drop
 * between opening a tool and generating is invisible.
 *
 * Pass `hasInput` from your own state, and exclude fields that get prefilled
 * from the saved profile or the event fires without the user doing anything.
 */
export function useFormStart(toolName: string, hasInput: boolean) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !hasInput) return;
    fired.current = true;
    track('form_start', { tool: toolName });
  }, [toolName, hasInput]);
}
