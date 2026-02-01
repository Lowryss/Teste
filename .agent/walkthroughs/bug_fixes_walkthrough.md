# Walkthrough: Critical Bug Fixes

I have addressed two critical issues blocking the Tarot features:

## 1. ReferenceError in Tarot Semestral
- **Issue:** The `Heart` icon component was being used but not imported in `page.tsx`.
- **Fix:** Added `Heart` to the import list from `lucide-react`.
- **Impact:** The page should now render without crashing.

## 2. Auth Context `getIdToken` Error
- **Issue:** Merging Firestore user data using the spread operator (`...user`) was stripping class methods from the Firebase User object, causing `user.getIdToken is not a function` errors.
- **Fix:** Manually re-attached critical methods (`getIdToken`, `reload`, `delete`, etc.) to the merged user object in `AuthContext.tsx`.
- **Impact:** All API calls requiring authentication (Horoscope, Tarot, Shop) should now work correctly.

## Verification Steps
1. Refresh the application.
2. Navigate to **Tarot Semestral** and verify it loads correctly.
3. Try to perform a reading to ensure `getIdToken` works.
4. Check other tools (Horoscope, Daily Tarot) to confirm Auth is stable.
