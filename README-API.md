# PropIntelli API Integration

This wireframe has been converted to a functional Next.js application that connects to your PropIntelli API.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
Copy the environment example file:
```bash
cp env.example .env.local
```

Edit `.env.local` and set your API base URL:
```bash
# For local development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/v1

# For production/staging
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/v1
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

### API Integration
- **Properties Search**: Connects to `GET /properties` endpoint
- **Filtering**: Supports all search parameters (country, area, price, rooms, size, etc.)
- **Pagination**: Handles page-based navigation with API pagination
- **Error Handling**: Shows loading states and error messages
- **Input Validation**: Numeric validation for price, rooms, and size fields

### Components

#### Filters Component (`components/Filters.tsx`)
- Search form with all property filters
- Real-time input validation
- Enter key support for quick searching
- Loading state management

#### Results Component (`components/Results.tsx`)
- Property cards with formatted data
- Loading, error, and empty states
- Pagination controls
- Links to original listings
- Responsive design

#### Main Page (`app/page.tsx`)
- API connection management
- State management for search results
- Error handling and user feedback

### API Endpoints Used

Based on your API tester at [http://propintelli-website.s3-website.eu-central-1.amazonaws.com/](http://propintelli-website.s3-website.eu-central-1.amazonaws.com/), the app expects:

- `GET /properties` - Property search with query parameters
- Response format: `{ data: [...], pagination: {...} }`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for your API | `http://localhost:3000/v1` |

### Deployment

For S3/CloudFront deployment:
1. Set `NEXT_PUBLIC_API_BASE_URL` at build time
2. Run `npm run build`
3. Deploy the `out` folder to S3

```bash
# Set environment variable and build
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/v1 npm run build
```

### API Response Format

The application expects your API to return:

```json
{
  "data": [
    {
      "id": "unique_id",
      "title": "Property Title",
      "price": 500000,
      "area": "Downtown",
      "rooms": 3,
      "size_sqm": 85,
      "links": {
        "primary_listing": "https://original-site.com/listing"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150
  }
}
```

## Troubleshooting

### API Connection Issues
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check CORS settings on your API server
- Ensure API is accessible from your domain

### Build Issues
- Make sure all dependencies are installed
- Check TypeScript configuration
- Verify environment variables are set

The application is designed to gracefully handle missing data fields and API errors, providing a smooth user experience even when the API is unavailable.



