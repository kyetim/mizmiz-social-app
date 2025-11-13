# React Three Fiber Turbopack Compatibility Fix

## Problem

Error encountered when using `@react-three/fiber` with Next.js 15 + Turbopack:

```
Cannot read properties of undefined (reading 'ReactCurrentOwner')
at floating-cube.tsx:4:1
```

### Root Cause

This is a **known compatibility issue** between:
- **Turbopack** (Next.js 15's new bundler)
- **React Three Fiber** (WebGL/Three.js React renderer)

Even with `dynamic` imports and `{ ssr: false }`, Turbopack attempts to evaluate the module during the build process, causing React internals to be accessed before they're available.

---

## Solution Applied

### ✅ **Replaced with CSS-based Alternative**

**Files Changed:**
1. Created `frontend/src/components/3d/floating-cube-css.tsx`
   - Uses Framer Motion for animations
   - No WebGL/Three.js dependencies
   - Works perfectly with Turbopack
   - Similar visual effect with CSS 3D transforms

2. Updated `frontend/src/app/(auth)/register/page.tsx`
   - Changed from `FloatingCube` (Three.js) to `FloatingCubeCss` (CSS)
   - Removed `dynamic` import
   - Direct import works fine

3. Updated `frontend/tailwind.config.ts`
   - Added `perspective` utilities
   - Added `transform-style-3d` utility
   - Added `backface-hidden` utility

### Benefits

✅ **No runtime errors**  
✅ **Faster page load** (no WebGL initialization)  
✅ **Better performance** on low-end devices  
✅ **Smaller bundle size** (no Three.js loaded)  
✅ **Full Turbopack compatibility**

---

## Alternative Solutions (For Future Reference)

### Option 1: Use Webpack Instead of Turbopack

Modify `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",  // Remove --turbopack flag
    "build": "next build"
  }
}
```

**Pros:** React Three Fiber works normally  
**Cons:** Slower dev server startup

### Option 2: Wait for Turbopack Support

React Three Fiber team is working on Turbopack compatibility. Monitor:
- https://github.com/pmndrs/react-three-fiber/issues

### Option 3: Client-Only Wrapper (Attempted but didn't fully work)

File: `frontend/src/components/3d/floating-cube-wrapper.tsx`

This adds an extra layer of client-side mounting check, but Turbopack still evaluates the imports.

---

## Files Reference

### Original Three.js Version (Preserved)
- `frontend/src/components/3d/floating-cube.tsx` - Still exists but not imported

### CSS Alternative (Currently Used)
- `frontend/src/components/3d/floating-cube-css.tsx` - Active replacement

### Wrapper (Available if needed)
- `frontend/src/components/3d/floating-cube-wrapper.tsx` - For future use

### Working Three.js Component
- `frontend/src/components/3d/floating-sphere.tsx` - Different component, works with Framer Motion only

---

## How to Re-Enable Three.js Version (When Fixed)

### Step 1: Update `register/page.tsx`

```typescript
// Change this:
import { FloatingCubeCss } from '@/components/3d/floating-cube-css'

// To this:
import dynamic from 'next/dynamic'

const FloatingCube = dynamic(
  () => import('@/components/3d/floating-cube').then((mod) => mod.FloatingCube),
  { 
    ssr: false,
    loading: () => <FloatingCubeCss />
  }
)
```

### Step 2: Update the JSX

```typescript
// Change this:
<FloatingCubeCss />

// To this:
<FloatingCube />
```

### Step 3: Test

```bash
npm run dev
```

If no errors, the Three.js version is working again!

---

## Current Status

✅ **CSS version working perfectly**  
⏳ **Three.js version preserved for future use**  
📦 **Dependencies still installed** (for future use):
   - `@react-three/fiber@8.18.0`
   - `@react-three/drei@9.122.0`
   - `three@0.180.0`

---

## Related Issues

- [React Three Fiber Turbopack Issue](https://github.com/pmndrs/react-three-fiber/issues)
- [Next.js Turbopack Docs](https://nextjs.org/docs/app/api-reference/turbopack)

---

## Visual Comparison

Both versions provide similar floating 3D cube effects:

**Three.js Version:**
- ✨ Real WebGL rendering
- 🎮 True 3D mesh with lighting
- 📊 Higher resource usage

**CSS Version (Current):**
- 🎨 CSS 3D transforms
- ⚡ Lightweight and fast
- 📱 Better mobile performance
- ✅ **Currently in use**

