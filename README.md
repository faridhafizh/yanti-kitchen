<div align="center">
  <img src="public/logo.svg" alt="Yanti's Kitchen Logo" width="120" height="120" />
  <h1>Yanti's Kitchen</h1>
  <p>Discover authentic Indonesian recipes, snacks, and traditional cakes.</p>
</div>

## Description

Yanti's Kitchen is a modern web application built to showcase delicious and authentic Indonesian recipes. It features a bilingual interface (English and Indonesian) and a beautiful, responsive design that looks great on both desktop and mobile devices.

## Features

- **Bilingual Support**: Toggle between English and Indonesian languages seamlessly.
- **Dark Mode**: Support for light and dark themes using `next-themes`.
- **Admin CMS**: A custom admin dashboard (`/admin`) for managing recipes (create, edit, delete) with a professional UI.
- **Authentication**: Secured admin area using JWT authentication via Next.js proxy. Registration includes an Editor role. Login uses an OTP sent via email (mocked with ethereal).
- **Data Storage**: Simplified JSON file storage (`data/recipes.json` and `data/users.json`) accessed via Next.js API Routes.
- **Responsive Design**: Mobile-first design utilizing Tailwind CSS, including a mobile hamburger menu.
- **Animations**: Fluid transitions and interactions powered by Framer Motion.

## Tech Stack

This project was built using the following technologies:

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Components:** Custom Shadcn/UI-style components using standard Tailwind classes and `@radix-ui/react-slot`
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Internationalization (i18n):** Custom React Context provider for handling EN/ID languages
- **Authentication:** `jsonwebtoken`, `bcryptjs`, and `nodemailer` for OTP delivery.
- **Backend/API:** Next.js Route Handlers with local JSON file data storage.
- **Security:** Next.js Proxy for secure cookie-based auth route protection.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Access the Admin CMS at [http://localhost:3000/admin](http://localhost:3000/admin).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
