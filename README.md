# Paradox Tech — E-commerce me Next.js & MongoDB

Aplikacion e-commerce full-stack i ndërtuar me Next.js (Pages Router), MongoDB dhe NextAuth. Përfshin katalog produktesh dinamik, shportë, pagesa me Stripe, menaxhim porosish, panel admini dhe profil përdoruesi.

> Projekt për lëndën **Zhvillim i Ueb-it në Anën e Klientit**.

## Veçoritë

- **Autentifikim** me NextAuth: Credentials (email/fjalëkalim me bcrypt) + OAuth (Google, Facebook).
- **Menaxhim rolesh** (user / seller / admin) me mbrojtje rrugësh përmes `middleware`.
- **CRUD** për produkte, porosi, postime blogu dhe mesazhe kontakti.
- **Shportë** (Context API + localStorage) dhe **pagesa me Stripe** (Payment Element).
- **Porosi**: ruhen në DB; admini ndryshon statusin (pending → paid → shipped → delivered / cancelled); klienti i sheh të vetat me përditësim live (polling).
- **Panel Admini**: statistika, përdorues, produkte, porosi me polling në kohë reale.
- **Profil përdoruesi**: të dhënat, porositë e mia, produktet e mia (për shitësit), ndryshim fjalëkalimi.
- **Data fetching**: SSG + ISR (home, shop, blog, about), getStaticPaths (detajet e produktit), getServerSideProps (kërkimi).
- **Forma me validim** përmes react-hook-form.
- **Mini-cart** popup në header me items, total, remove button.
- **Live polling** (5s) në dashboard dhe profile tabs pa flickering.
- **Lazy loading** i imazheve dhe dizajn **responsive** me Tailwind CSS.
- **Teste** me Jest + React Testing Library (4 suites, 9 tests passed ✅).

## Teknologjitë

Next.js 14 (Pages Router) + TypeScript, MongoDB + Mongoose, NextAuth.js, Stripe (Payment Element), Tailwind CSS, react-hook-form, react-hot-toast, Jest + React Testing Library.

## Struktura e faqeve

| Faqja | Rruga | Lloji |
|---|---|---|
| Home | `/` | SSG + ISR (60s) |
| E-shop (Produktet) | `/shop` | SSG + ISR |
| Detajet e produktit | `/shop/[slug]` | SSG + getStaticPaths + ISR |
| About | `/about` | SSG + ISR |
| Blog | `/blog` | SSG + ISR |
| Contact | `/contact` | Formë + ruajtje në DB |
| Kërko | `/search` | getServerSideProps (SSR) |
| Cart | `/cart` | Client + Context |
| Checkout | `/checkout` | Stripe Payment Element |
| Login / Register | `/login`, `/register` | NextAuth + validim |
| Profili | `/profile` | I mbrojtur (i kyçur) — tabs: Porositë, Produktet (shitësit) |
| Dashboard (Admin) | `/dashboard` | I mbrojtur (admin) — tabs: Overview, Përdorues, Produktet, Porositë |
| 404 | `*` | Custom |

## Instalimi

```bash
git clone https://github.com/valo0n/NextJs-Project.git
cd NextJs-Project
npm install
# krijo .env.local (shih më poshtë)
npm run dev
```

Hape `http://localhost:3000`.

## Variablat e ambientit (.env.local)

```env
# MongoDB (lokalisht ose Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/paradox

# NextAuth
NEXTAUTH_SECRET=nje-string-i-gjate-random-supersecreti
NEXTAUTH_URL=http://localhost:3000

# OAuth (opsionale)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> `.env.local` nuk ngarkohet në git. Çelësat vendosen veçmas në Vercel.

## Skriptet

```bash
npm run dev      # zhvillim
npm run build    # build prodhimi
npm start        # nis build-in e prodhimit
npm run lint     # ESLint
npm test         # teste me Jest
```

## Mbjellja e të dhënave (seed)

Me serverin duke punuar lokalisht, hap në browser:

- `http://localhost:3000/api/seed` — produktet
- `http://localhost:3000/api/blog/seed` — postet e blogut

Për të krijuar një **admin**:

```bash
MONGODB_URI="mongodb://127.0.0.1:27017/paradox" node scripts/createAdmin.js admin@paradox.com FjalaJote123 "Admin"
```

## Testimi

```bash
npm test
```

**Rezultatet e testeve:**
```
✅ web-project@0.1.0 test
✅ jest

PASS __tests__/contact.test.ts
PASS __tests__/Button.test.tsx
PASS __tests__/Footer.test.tsx
PASS __tests__/Card.test.tsx

Test Suites: 4 passed, 4 total
Tests: 9 passed, 9 total
Snapshots: 0 total
Time: 3.566s
```

Teste për komponentët (Button, Card, Footer) dhe për API route-t (`/api/contact`).

## Deploy në Vercel

1. Ngarko projektin në GitHub.
2. Te vercel.com → **Add New Project** → importo repo-n.
3. Te **Environment Variables**, shto të gjitha variablat:
   - `MONGODB_URI` = MongoDB Atlas connection string
   - `NEXTAUTH_SECRET` = një string random i sigurt
   - `NEXTAUTH_URL` = URL-ja e Vercel-it (p.sh. `https://next-js-project-xyz.vercel.app`)
   - `STRIPE_SECRET_KEY` dhe `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Kliko **Deploy**.

> Për MongoDB në prodhim përdor **MongoDB Atlas** (cloud); `localhost` nuk është i qasshëm nga Vercel.

## Kredencialet e testimit

**Admin login:**
- Email: `admin@paradox.com`
- Password: `FjalaJote123`

**Stripe test card:**
- Card: `4242 4242 4242 4242`
- Ekspirim: çfarëdo data në të ardhmen
- CVC: çfarëdo numër 3-sh/4-sh shifra

## Përmbledhja e funksionaliteteve

✅ 14 faqe funksionale dhe të ndërlidhura  
✅ 6+ komponentë të ripërdorshëm (Header, Footer, Card, Button, Modal, Layout)  
✅ Autentifikim NextAuth me menaxhim rolesh (user, seller, admin)  
✅ CRUD për produktet, porositë, postimet e blogut, mesazhet e kontaktit  
✅ MongoDB me 5+ modele (User, Product, Order, BlogPost, Contact)  
✅ Hooks: useState, useEffect, Custom CartContext (Context API)  
✅ Data fetching: SSG, SSR, ISR, getStaticPaths  
✅ Forma me validim (Login, Register, Contact, Checkout)  
✅ Tailwind CSS responsive + lazy loading imazhesh  
✅ Teste: 4 suites, 9 tests ✅  
✅ Deployment në Vercel + env variables  
✅ Mini-cart, live polling, payment integration  

---

## Screenshots

_(Shto këtu screenshots të aplikacionit)_

---

## Anëtarët e grupit

| Emri | Kontributi |
|---|---|
| **Edin Gerbeshi** | Autentifikimi (NextAuth), Panel Admini, Dashboard, Data fetching (SSG/SSR/ISR) |
| **Elsa Gashi** | Produktet & Katalogi, Detajet e produktit, Shportë, Checkout me Stripe, Porositë |
| **Valonn** | Projekti overall, Profili përdoruesi, Blog, Contact forma, Teste, Deployment |

---

## Link i aplikacionit live

🚀 **[Paradox Tech Live](https://next-js-project-sizs-1rtzr49es-valonnura2002.vercel.app)**

---

## Liçenza

MIT