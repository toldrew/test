# Testing Guide for Home Page

## Quick Start
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173/`

## Test Scenarios

### 1. Theme Toggle
**Steps:**
1. Look for the theme toggle button in the top-right corner (🌙 or 🌞)
2. Click it to switch between light and dark themes
3. Verify smooth transition
4. Check that all colors change appropriately
5. Reload the page - theme should persist

**Expected Results:**
- Light theme: Clean white background, purple accents
- Dark theme: Dark background with neon purple/pink glow effects
- Theme persists after page reload

### 2. Create Tournament - Basic Flow
**Steps:**
1. Click "Создать турнир" button in hero section
2. Fill in tournament name (e.g., "Summer League 2024")
3. Select tournament type (Groups or Playoff)
4. Set number of teams to 4
5. Set number of rounds to 2
6. Click "Автозаполнение" to auto-generate teams
7. Verify 4 teams are selected
8. Click "Создать турнир"

**Expected Results:**
- Modal opens smoothly
- Auto-generated teams appear with names "Команда 1", "Команда 2", etc.
- Tournament is created successfully
- Schedule appears below with all matches
- Smooth scroll to schedule section

### 3. Create Tournament - Manual Team Creation
**Steps:**
1. Click "Создать турнир"
2. In the "Добавить новую команду" section, enter team name "Real Madrid"
3. Optionally upload a logo image
4. Click "Добавить"
5. Repeat for 3 more teams
6. Fill in tournament details
7. Click "Создать турнир"

**Expected Results:**
- Teams appear in the selection list
- Uploaded logos are displayed as previews
- Teams can be selected/deselected
- Selected teams are used in the tournament
- Schedule shows custom team names and logos

### 4. View Tournament Schedule
**After creating a tournament:**

**Expected Display:**
- Tournament name as heading
- Summary chips showing:
  - Number of teams (👥)
  - Number of rounds (🎮)
  - Creation date (📅)
  - Match completion status (✅)
- Rounds displayed in cards
- Each match shows:
  - Home team vs Away team
  - Match date and time (📅)
  - Location (📍)
  - Status badge (colored)
  - Action buttons

### 5. Edit Match Details
**Steps:**
1. Create a tournament with schedule
2. Click "✏️ Редактировать" on any match
3. Change the date to tomorrow
4. Change the time to 18:00
5. Change location to "Central Stadium"
6. Click "Сохранить"

**Expected Results:**
- Modal opens with pre-filled data
- Changes are saved
- Modal closes
- Match card updates immediately
- Reload page - changes persist

### 6. Enter Match Result
**Steps:**
1. Click "⚽ Введите результат" on any match
2. Enter home team score: 3
3. Enter away team score: 1
4. Add notes: "Great game!"
5. Click "Сохранить"

**Expected Results:**
- Modal opens with result section
- Scores are validated (no negative numbers)
- Match status changes to "Завершен" (Completed)
- Scores appear in the match card
- Summary chip updates (completed matches count increases)
- Team stats are updated

### 7. Responsive Design Testing
**Steps:**
1. Open browser dev tools
2. Toggle device toolbar
3. Test at various screen sizes:
   - Mobile (320px, 375px, 414px)
   - Tablet (768px, 1024px)
   - Desktop (1280px, 1920px)

**Expected Results:**
- Mobile: Single column layout, stacked cards
- Tablet: 2-column grid for features
- Desktop: Full multi-column layout
- All text remains readable
- Buttons are touch-friendly on mobile
- No horizontal scrolling

### 8. Scroll Animations
**Steps:**
1. Load the home page
2. Scroll down slowly through all sections
3. Observe each section as it comes into view

**Expected Results:**
- Sections fade in and slide up as they enter viewport
- Animation is smooth (no jank)
- Animations only trigger once per section
- Works in both themes

### 9. Modal Interactions
**Test closing modals:**
1. Click "Создать турнир"
2. Try closing the modal by:
   - Clicking the X button
   - Clicking the overlay
   - Pressing ESC key
   - Clicking "Отмена" button

**Expected Results:**
- All methods close the modal
- Modal slides down smoothly
- Form is reset when reopened

### 10. Validation Testing
**Create Tournament Modal:**
1. Click "Создать турнир"
2. Try to submit without filling anything
3. Try to submit with only team name
4. Try to submit without selecting teams

**Expected Results:**
- Error messages appear in red
- Specific field errors shown below inputs
- Cannot submit until all required fields are valid
- Error messages are in Russian

### 11. Data Persistence
**Steps:**
1. Create a tournament with custom teams
2. Enter results for a few matches
3. Close the browser tab
4. Reopen the page
5. Check the schedule section

**Expected Results:**
- Latest tournament is still displayed
- All match results are preserved
- Team information is intact
- Date/time modifications persist

### 12. Multi-Round Tournaments
**Steps:**
1. Create tournament with 4 teams and 2 rounds
2. Check the schedule

**Expected Results:**
- Two sets of rounds appear
- Round numbers are sequential (1, 2, 3, 4, 5, 6...)
- Home/away is alternated in second round
- All teams play each other twice

## Known Behaviors

1. **Auto-generated Teams**: Named sequentially as "Команда 1", "Команда 2", etc.
2. **Match Scheduling**: Matches are scheduled sequentially with default 90-minute duration
3. **Bye Matches**: Skipped automatically for odd number of teams
4. **Local Storage**: All data stored in browser's localStorage
5. **Current User**: Defaults to 'guest' until authentication is implemented

## Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] No layout shifts during load
- [ ] Images load progressively
- [ ] Theme toggle is instant

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Common Issues to Watch For

1. **Theme not persisting**: Check localStorage in dev tools
2. **Scores not updating**: Verify store actions are being called
3. **Modal not closing**: Check event handlers
4. **Animations not working**: Verify IntersectionObserver support
5. **Layout breaks on mobile**: Check responsive CSS media queries
