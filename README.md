# Cloudflare Workers API with Hono and GraphQL Yoga

A modern API built using Cloudflare Workers, Hono framework, and GraphQL Yoga. This project provides a scalable and efficient way to create serverless APIs with GraphQL support.

## 🚀 Features

- Facebook Page information retrieval
- Detailed page statistics (followers, follows, media counts)
- Media posts with engagement metrics
- Stories with performance analytics
- Built on serverless architecture

## 📊 Schema

### Main Types

#### FbPage
- Basic page information
- Links to detailed page data

#### PageDetail
- Comprehensive page statistics
- Profile information
- Media collection
- Stories collection

#### Media
- Post details
- Engagement metrics (likes, comments, shares)
- Performance metrics (reach, saves)
- Media content information

#### Story
- Story content
- Engagement metrics
- Performance analytics

## 🔍 Queries


## 🚀 Technologies

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
- [Hono](https://hono.dev/) - Lightweight web framework
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) - Fully-featured GraphQL Server
- [TypeScript](https://www.typescriptlang.org/) - Type safety and modern JavaScript features

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or later)
- Cloudflare account
- Wrangler CLI

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/your-project-name.git
cd your-project-name
```
2. Install dependencies:
```
npm install
```
3. Configure Wrangler:
Create or modify `wrangler.toml` with your project settings.

4. Start the development server:
```
npm run dev
```
5. Deploy to Cloudflare Workers:
```
npm run deploy
```
6. Create info.ts
   
export const TOKEN = "your_facebook_graph_api_token"

export const URL = "https://graph.facebook.com/v21.0"

## 📁 Project Structure
```
├── src/
│ ├── index.ts # Main application entry
│ ├── graphql/
│ │ ├── type.ts # GraphQL type definitions
│ │ └── resolver.ts # GraphQL resolvers
│ └── ...
├── wrangler.toml # Cloudflare Workers configuration
└── package.json
```




