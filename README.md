# PackDrop

A minimal free Minecraft resource pack hosting service.

## Requirements
- Node.js 18.17+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Uploads are stored in `./uploads`. The API calculates SHA-1 with Node's crypto module and returns a direct `/r/<id>.zip` URL.

## Production

This starter stores files on the local filesystem. For a real public hosting service, replace the filesystem storage in `app/api/upload/route.ts` and `app/r/[file]/route.ts` with object storage (S3/R2/etc.) and put the app behind a domain/CDN.

The default upload limit is 100 MB.
