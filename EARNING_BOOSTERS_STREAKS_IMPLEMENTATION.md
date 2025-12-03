# Earning Boosters & Streak Rewards Implementation

## Summary

Implemented **A) Earning Boosters** and **B) Streak Rewards + Badges** as frontend-only mock modules for Sparkio.

## Files Created

### Mock Data
- `src/lib/mock-data/boosters.ts` - Booster data, localStorage management, and payout calculation engine
- `src/lib/mock-data/streaks.ts` - Streak tracking, calendar data, and milestone management

### Components
- `src/components/boosters/BoosterCard.tsx` - Individual booster card with countdown timer
- `src/components/boosters/index.ts` - Export file
- `src/components/badges/StreakCalendar.tsx` - 30-day streak calendar visualization
- `src/components/badges/StreakProgress.tsx` - Streak progress card with milestone tracking
- `src/components/badges/index.ts` - Export file

### Updated Pages
- `app/dashboard/page.tsx` - Added "Earning Boosters" section
- `app/dashboard/insights/page.tsx` - Added boosters and streak progress sections, added streak badges
- `app/dashboard/profile/page.tsx` - Added streak calendar section

## Features Implemented

### A) Earning Boosters

1. **Booster Types:**
   - Time-limited multiplier (e.g., 2× App tasks for 2 hours)
   - Category boost (e.g., UPI tasks +30% for 4 hours)

2. **Booster Card Features:**
   - Title, description, multiplier badge
   - Real-time countdown timer (hh:mm:ss format)
   - "Claim & Activate" button for claimable boosters
   - "Deactivate" button for active boosters
   - Visual indication when active (orange glow, border)
   - Accessibility: aria-live region for countdown announcements

3. **Booster Engine:**
   - `calculateBoostedPayout()` function applies active boosters to task payouts
   - Supports multiple active boosters (multiplicative)
   - Category-specific boosts only apply to matching task types

4. **LocalStorage Keys:**
   - `sparkio_active_boosters` - Array of active booster objects with expiration timestamps

### B) Streak Rewards + Badges

1. **Streak System:**
   - Tracks consecutive days of activity
   - Automatically resets if gap > 1 day
   - Records longest streak achieved
   - Milestone rewards: 3, 7, 14, 30, 60, 100 days

2. **Streak Progress Card:**
   - Current streak display with flame icon
   - Progress bar to next milestone
   - Next milestone reward preview
   - "View Streak History" modal with detailed stats

3. **Streak Calendar:**
   - 30-day calendar view
   - Visual indicators for days with activity (flame icon)
   - Highlights today's date
   - Shows current and longest streak stats

4. **Streak Badges:**
   - Added "7-Day Streak" badge (unlocked)
   - Added "30-Day Streak" badge (in progress)
   - Integrated with existing badge system

5. **LocalStorage Keys:**
   - `sparkio_streak_data` - Streak data object with current streak, history, milestones

## How to Test

### Testing Boosters

1. **Navigate to `/dashboard`**
   - Scroll to "Earning Boosters" section
   - You should see 3 booster cards

2. **Claim a Booster:**
   - Click "Claim & Activate" on any claimable booster
   - Booster should activate with orange glow
   - Countdown timer should appear and update every second
   - Check browser console for localStorage: `localStorage.getItem('sparkio_active_boosters')`

3. **Test Countdown:**
   - Wait and observe countdown decreasing
   - When expired, booster should show "Booster expired"
   - Expired boosters are automatically removed from localStorage

4. **Deactivate Booster:**
   - Click "Deactivate" on an active booster
   - Booster should return to inactive state
   - Countdown should disappear

5. **Test Booster Engine:**
   - In browser console, run:
     ```javascript
     import { calculateBoostedPayout, activateBooster, AVAILABLE_BOOSTERS } from '@/lib/mock-data/boosters';
     activateBooster(AVAILABLE_BOOSTERS[0]); // Activate 2x App booster
     calculateBoostedPayout(100, 'App'); // Should return 200 (2x)
     calculateBoostedPayout(100, 'UPI'); // Should return 100 (no boost)
     ```

6. **Navigate to `/dashboard/insights`**
   - Check "Earning Boosters" section in the grid
   - Should show 2 boosters in compact view

### Testing Streaks

1. **Navigate to `/dashboard/insights`**
   - Find "Streak Progress" card
   - Should show current streak, next milestone, progress bar

2. **View Streak History:**
   - Click "View Streak History" button
   - Modal should show current streak, longest streak, total active days

3. **Navigate to `/dashboard/profile`**
   - Scroll to "Daily Streak Calendar" section
   - Should show 30-day calendar grid
   - Days with activity show flame icon
   - Today's date should be highlighted with ring

4. **Test Streak Recording:**
   - In browser console, run:
     ```javascript
     import { recordStreakActivity, getStreakData } from '@/lib/mock-data/streaks';
     recordStreakActivity();
     getStreakData(); // Should show updated streak
     ```

5. **Reset Streak Data (for testing):**
   - In browser console: `localStorage.removeItem('sparkio_streak_data')`
   - Refresh page to see reset state

6. **Check Streak Badges:**
   - Navigate to `/dashboard/insights`
   - Scroll to "Your Achievements" section
   - Should see "7-Day Streak" (unlocked) and "30-Day Streak" (in progress) badges

## LocalStorage Keys Reference

- `sparkio_active_boosters` - Array of active booster objects
  ```json
  [
    {
      "id": "boost-2x-app-2h",
      "isActive": true,
      "expiresAt": 1234567890,
      "claimedAt": 1234567890
    }
  ]
  ```

- `sparkio_streak_data` - Streak tracking object
  ```json
  {
    "currentStreak": 5,
    "longestStreak": 7,
    "lastActivityDate": "2024-08-22",
    "streakHistory": ["2024-08-18", "2024-08-19", ...],
    "nextMilestone": 7,
    "nextMilestoneReward": "₹150 bonus"
  }
  ```

## Accessibility Features

- **Countdown Timer:** Uses `aria-live="polite"` and `aria-atomic="true"` for screen reader announcements
- **Progress Bars:** Include `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label`
- **Keyboard Navigation:** All buttons are keyboard accessible
- **Visual Indicators:** Color-coded states with sufficient contrast

## Responsive Design

- Boosters grid: 1 column mobile, 2 tablet, 3 desktop
- Streak calendar: Responsive grid with proper spacing
- All components stack vertically on mobile

## Next Steps (Future Features)

- Integrate booster engine into task payout display on `/dashboard/tasks`
- Add notification when booster expires
- Add streak milestone celebration modal
- Connect streak recording to actual task completion events

