# 🎨 MIZMIZ Renk Sistemi

## ⚠️ ÖNEMLİ: Renk Kullanım Kuralları

### 🚫 YAPMA
```tsx
// ❌ CSS variable kullanma - görünmezlik sorununa neden olur
className="bg-primary-600 text-white"
className="text-primary-700"
className="border-primary-200"
```

### ✅ YAP
```tsx
// ✅ Doğrudan Tailwind class kullan
className="bg-green-600 text-white"
className="text-green-700"
className="border-green-200"
```

---

## 🎨 Renk Paleti (Peerlist-inspired)

### Primary/Accent Color: GREEN
```css
bg-green-50    /* Çok açık - badges, backgrounds */
bg-green-100   /* Açık - hover states, icons bg */
bg-green-200   /* Soft - borders */
bg-green-600   /* Main - buttons, logos, links */
bg-green-700   /* Dark - hover states */

text-green-50  /* Beyaza yakın - dark bg üzerinde */
text-green-600 /* Main - links, accents */
text-green-700 /* Dark - badges */
```

### Neutral Colors: GRAY
```css
bg-gray-50     /* Çok açık - page background */
bg-gray-100    /* Açık - cards, inputs */
bg-gray-200    /* Orta - borders, dividers */

text-gray-600  /* Orta - secondary text */
text-gray-800  /* Koyu - body text */
text-gray-900  /* En koyu - headings */
```

### System Colors
```css
/* Success */
bg-green-600 text-white

/* Error/Destructive */
bg-red-600 text-white

/* Warning */
bg-yellow-600 text-white

/* Info */
bg-blue-600 text-white
```

---

## 🧩 Component Örnekleri

### Buttons
```tsx
// Primary Button
<button className="bg-green-600 hover:bg-green-700 text-white">
  Gönder
</button>

// Secondary Button
<button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300">
  İptal
</button>

// Ghost Button
<button className="bg-transparent hover:bg-gray-100 text-gray-700">
  Daha Fazla
</button>
```

### Avatars / Icons
```tsx
// Avatar
<div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-sm">
  <span className="text-white font-semibold">K</span>
</div>

// Icon Container
<div className="bg-green-100 rounded-lg text-green-600">
  <Icon />
</div>
```

### Cards
```tsx
// White Card
<div className="bg-white border border-gray-200 rounded-xl shadow-sm">
  Content
</div>

// Glassmorphism Card
<div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg">
  Content
</div>

// Gradient Card (CTA)
<div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl shadow-2xl">
  <h2 className="text-white">Başlık</h2>
  <p className="text-green-50">Açıklama</p>
</div>
```

### Links
```tsx
// Primary Link
<a className="text-green-600 hover:text-green-700 hover:underline">
  Link
</a>

// Nav Link (Active)
<a className="text-green-600 bg-green-50 rounded-lg">
  Ana Sayfa
</a>

// Nav Link (Inactive)
<a className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
  Keşfet
</a>
```

### Badges
```tsx
// Info Badge
<span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
  Yeni
</span>

// Status Badge
<span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold border border-gray-200">
  Sprint 4
</span>
```

### Inputs
```tsx
// Text Input
<input className="bg-gray-100 hover:bg-gray-200 border-0 focus:ring-2 focus:ring-green-600 text-gray-900 placeholder:text-gray-500 rounded-lg" />

// Textarea
<textarea className="bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600 text-gray-900 rounded-lg" />
```

---

## 🎯 Görünürlük Kontrol Listesi

Her yeni component/özellik eklerken kontrol et:

- [ ] Logo "M" harfi görünüyor mu? (bg-green-600 + text-white)
- [ ] Butonlar görünüyor mu? (bg-green-600 + text-white)
- [ ] Avatar harfleri görünüyor mu? (bg-green gradient + text-white)
- [ ] Link'ler belirgin mi? (text-green-600)
- [ ] Icon'lar görünüyor mu? (text-green-600 veya bg-green-100)
- [ ] Başlıklar okunuyor mu? (text-gray-900)
- [ ] Body text okunuyor mu? (text-gray-800 veya text-gray-900)
- [ ] Placeholder'lar görünüyor mu? (text-gray-500 veya text-gray-600)

---

## 🔧 Hızlı Düzeltme

Eğer bir element görünmüyorsa:

1. **Inspect et** - Chrome DevTools
2. **Computed styles'a bak** - Renk ne?
3. **CSS variable kontrolü** - `var(--primary)` varsa sil
4. **Doğrudan class ekle** - `bg-green-600`, `text-white`, etc.
5. **Shadow ekle** - Depth için `shadow-sm`, `shadow-md`, `shadow-lg`

---

## 📌 Önemli Notlar

- ✅ **Tailwind class'ları değişmez** - `bg-green-600` her zaman `#16a34a`
- ❌ **CSS variables değişebilir** - `var(--primary)` runtime'da farklı olabilir
- ✅ **Contrast her zaman yeterli** - WCAG AA standartları
- ✅ **Shadow'lar depth ekler** - Öğeleri öne çıkarır

---

## 🚀 Yeni Component Eklerken Template

```tsx
// ✅ DOĞRU Component Template
export function MyComponent() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-sm">
          <span className="text-white font-semibold">K</span>
        </div>
        <h3 className="font-bold text-gray-900">Başlık</h3>
      </div>
      
      {/* Content */}
      <p className="text-gray-800 mb-4">İçerik metni</p>
      
      {/* Actions */}
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
        Buton
      </button>
    </div>
  )
}
```

---

Bu kuralları her yeni özellik eklerken takip et! 🎨

