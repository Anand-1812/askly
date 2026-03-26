# Askly

Askly is a Next.js + Appwrite community Q&A platform.

## Local Setup

1. Install dependencies:
```bash
npm install
```

2. Copy env file and fill values:
```bash
cp .env.example .env.local
```

3. Start dev server:
```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

The build uses webpack (`next build --webpack`) for stable production builds.

## Vercel Deployment

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the repo into Vercel.
3. In Vercel Project Settings -> Environment Variables, add all values from `.env.example`.
4. Deploy.

Required environment variables:
- `NEXT_PUBLIC_APPWRITE_HOST_URL`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
- `NEXT_PUBLIC_APPWRITE_QUESTIONS_COLLECTION_ID`
- `NEXT_PUBLIC_APPWRITE_ANSWERS_COLLECTION_ID`
- `NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID`
- `NEXT_PUBLIC_APPWRITE_VOTES_COLLECTION_ID`
- `NEXT_PUBLIC_APPWRITE_QUESTION_BUCKET_ID`
- `APPWRITE_API_KEY`

## Notes

- `APPWRITE_API_KEY` is server-only. Set it in Vercel, never expose it in frontend code.
- For tags to support multiple values, Appwrite `tags` should be configured as `String[]` with max length `50` per item.
