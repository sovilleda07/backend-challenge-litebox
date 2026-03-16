# LiteTech API - Backend

Lightweight REST API backend built with **NestJS**, **TypeScript**, and **Prisma** for the LiteBox Technology Blog. It provides endpoints for managing related posts and handling image uploads directly to **Cloudinary**.

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted on [Supabase](https://supabase.com/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Storage:** [Cloudinary](https://cloudinary.com/) (for image uploads via Multer)
- **Documentation:** Swagger (OpenAPI)

## Features

- **Post Management:** Get and create related posts.
- **Image Upload:** Upload post images seamlessly to Cloudinary.
- **Validation:** Built-in validation for files (max 5MB, specific image formats like JPEG, PNG, WEBP) and DTOs using `class-validator`.
- **API Documentation:** Auto-generated Swagger documentation.

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database (e.g., Supabase)
- Cloudinary account for storing images

## Project Structure

```text
backend/
├── prisma/
│   └── schema.prisma            # Database schema and models
├── src/
│   ├── posts/
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── posts.controller.ts  # Route handlers for posts
│   │   ├── posts.module.ts      # Posts feature module
│   │   └── posts.service.ts     # Business logic
│   ├── app.module.ts            # Main application module
│   ├── cloudinary.service.ts    # Cloudinary integration
│   ├── main.ts                  # Application entry point
│   └── prisma.service.ts        # Prisma ORM setup
├── test/                        # E2E Tests
├── .env                         # Environment variables
└── package.json
```

## Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```env
PORT=
DATABASE_URL="postgresql://user:password@localhost:5432/your_db"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## Getting Started

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma Client and push the schema to your database:**
   ```bash
   npx prisma generate
   npx prisma db push
   # Alternatively, if you use migrations: npx prisma migrate dev
   ```

3. **Start the application:**
   ```bash
   # development
   npm run start
   
   # watch mode
   npm run start:dev
   
   # production mode
   npm run start:prod
   ```

## API Endpoints

### Live Environment
- **API URL:** [https://dev-sonia-daniela-villeda-guerra-backend.onrender.com](https://dev-sonia-daniela-villeda-guerra-backend.onrender.com)
- **Swagger Documentation:** [https://dev-sonia-daniela-villeda-guerra-backend.onrender.com/api/docs](https://dev-sonia-daniela-villeda-guerra-backend.onrender.com/api/docs)

### Local Environment
Once the application is running, you can access the Swagger API documentation at:
**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)** (or your configured port).

### 1. Get Related Posts
- **GET** `/api/posts/related`
- **Query Parameters:** `limit` (Optional, number)
- **Description:** Returns a list of related posts. No limit brings all posts.

Example:
```bash
curl -X GET "http://localhost:3000/api/posts/related?limit=5"
```

Response:
```json
{
   "id": 1,
   "title": "Mi post",
   "imageUrl": "https://res.cloudinary.com/...",
   "createdAt": "2026-03-10T00:00:00.000Z"
}
```

### 2. Create a Related Post
- **POST** `/api/post/related`
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `title` (text, max 100 characters)
  - `image` (file: jpeg, jpg, png, gif, webp — max 5MB)
- **Description:** Creates a new post and uploads the provided image to Cloudinary.

Example:
```bash
curl -X POST "http://localhost:3000/api/post/related" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Mi post" \
  -F "image=@/path/to/image.jpg"
```

Response:
```json
{
  "id": 1,
  "title": "Mi post",
  "imageUrl": "https://res.cloudinary.com/tu_cloud/image/upload/v123/litebox/abc.jpg",
  "createdAt": "2026-03-10T00:00:00.000Z"
}
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
