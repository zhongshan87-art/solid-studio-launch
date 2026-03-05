

## Plan: Fix GIF Duration to 3 Seconds

The `GIF_DURATION` constant in `src/components/Header.tsx` is currently set to `2000`ms but the actual GIF is 3 seconds long. This causes the freeze to happen too early, before the animation completes.

### Change
- Update `GIF_DURATION` from `2000` to `3000` in `src/components/Header.tsx` (line 5).

