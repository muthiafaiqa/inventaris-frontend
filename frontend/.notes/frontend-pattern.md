# Frontend Coding Patterns

- Struktur: Feature-based (`src/features/[feature_name]`).
- API: Gunakan `src/lib/axios.ts` untuk instance Axios + Interceptor JWT.
- Styling: Gunakan Tailwind CSS (tanpa file CSS tambahan kecuali index.css).
- State: Hindari Redux, gunakan custom hooks (`use[Feature]`) untuk logika bisnis.