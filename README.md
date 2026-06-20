# Paradox Tech — E-commerce me Next.js & MongoDB

Aplikacion e-commerce full-stack i ndërtuar me Next.js (Pages Router), MongoDB dhe NextAuth. Përfshin katalog produktesh dinamik, shportë, pagesa me Stripe, menaxhim porosish, panel admini dhe profil përdoruesi.

> Projekt për lëndën **Zhvillim i Ueb-it në Anën e Klientit**.

## Veçoritë

- **Autentifikim** me NextAuth: Credentials (email/fjalëkalim me bcrypt) + OAuth (Google, Facebook).
- **Menaxhim rolesh** (user / seller / admin) me mbrojtje rrugësh përmes `middleware`.
- **CRUD** për produkte, porosi, postime blogu dhe mesazhe kontakti.
- **Shportë** (Context API + localStorage) dhe **pagesa me Stripe** (Embedded Checkout — forma brenda faqes).
- **Porosi**: ruhen në DB; admini ndryshon statusin (pending → paid → shipped → delivered / cancelled); klienti i sheh të vetat me përditësim live (polling).
- **Panel Admini**: statistika, përdorues, produkte, porosi.
- **Profil përdoruesi**: të dhënat, porositë e mia, ndryshim fjalëkalimi.
- **Data fetching**: SSG + ISR (home, shop, blog, about), getStaticPaths (detajet e produktit), getServerSideProps (kërkimi).
- **Forma me validim** përmes react-hook-form.
- **Lazy loading** i imazheve dhe dizajn **responsive** me Tailwind CSS.
- **Teste** me Jest + React Testing Library.

## Teknologjitë

Next.js 14 (Pages Router) + TypeScript, MongoDB + Mongoose, NextAuth.js, Stripe (Embedded Checkout), Tailwind CSS, react-hook-form, react-hot-toast, Jest + React Testing Library.

## Struktura e faqeve

| Faqja | Rruga | Lloji |
|---|---|---|
| Home | `/` | SSG + ISR |
| E-shop (Produktet) | `/shop` | SSG + ISR |
| Detajet e produktit | `/shop/[slug]` | SSG + getStaticPaths + ISR |
| About | `/about` | SSG + ISR |
| Blog | `/blog` | SSG + ISR |
| Contact | `/contact` | Formë + ruajtje në DB |
| Kërko | `/search` | getServerSideProps (SSR) |
| Cart | `/cart` | Client + Context |
| Checkout | `/checkout` | Stripe Embedded |
| Login / Register | `/login`, `/register` | NextAuth |
| Profili | `/profile` | I mbrojtur (i kyçur) |
| Dashboard (Admin) | `/dashboard` | I mbrojtur (admin) |
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
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/paradox

# NextAuth
NEXTAUTH_SECRET=nje-string-i-gjate-random
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

Me serverin duke punuar, hap në browser:

- `http://localhost:3000/api/seed` — produktet
- `http://localhost:3000/api/blog/seed` — postet e blogut

Për të krijuar një **admin**:

```bash
node scripts/createAdmin.js admin@paradox.com FjalaJote123 "Admin"
```

## Testimi

```bash
npm test
```

Teste për komponentët (Button, Card, Footer) dhe për API route-t (`/api/contact`).

## Deploy në Vercel

1. Ngarko projektin në GitHub.
2. Te vercel.com → **Add New Project** → importo repo-n.
3. Te **Environment Variables**, shto të gjitha variablat nga `.env.local` (përdor `MONGODB_URI` të MongoDB Atlas, jo localhost).
4. Vendos `NEXTAUTH_URL` = URL-ja e prodhimit.
5. Kliko **Deploy**.

> Për MongoDB në prodhim përdor **MongoDB Atlas** (cloud); `localhost` nuk është i qasshëm nga Vercel.

## Screenshots

_(Shto këtu screenshots të aplikacionit)_

## Anëtarët e grupit

| Emri | Roli / Kontributi |
|---|---|
| _Emri 1_ | _p.sh. Auth, Dashboard_ |
| _Emri 2_ | _p.sh. Produkte, Shportë, Stripe_ |

---

**Link i aplikacionit live:** _(shto linkun e Vercel këtu)_