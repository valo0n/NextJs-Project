# Paradox Tech - Next.js Full-Stack

Projekt për lëndën **Zhvillim i Ueb-it në Anën e Klientit**.

## Stack
- **Next.js 14** (Pages Router) + **TypeScript**
- **MongoDB** + Mongoose
- **NextAuth** (Credentials + Google + Facebook)
- **Tailwind CSS**
- **react-hook-form**
- **Jest** + React Testing Library

## Instalimi

```bash
npm install
```

## Konfigurimi

`.env.local` është gjenerisht aty. Sigurohu që ke MongoDB duke punuar lokal në portin 27017.

## Run

```bash
npm run dev
```

Hap http://localhost:3000

## Struktura

```
web-project/
├── pages/
│   ├── index.tsx               ← Home page (Paradox Tech design)
│   ├── _app.tsx
│   ├── _document.tsx
│   └── api/
│       └── auth/
│           ├── [...nextauth].ts  ← NextAuth
│           └── register.ts       ← Register endpoint
├── components/                 ← Header, Footer, Layout
├── models/                     ← User, Product, Comment (Mongoose)
├── lib/
│   ├── dbConnect.ts            ← Lidhja me MongoDB
│   └── figmaAssets.ts          ← URL-të e imazheve
├── context/                    ← CartContext
├── hooks/                      ← useFetch
├── types/                      ← TypeScript types
├── middleware.ts               ← Role-based routing
└── styles/                     ← Globals CSS
```
