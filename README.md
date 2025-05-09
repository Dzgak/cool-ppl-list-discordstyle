# Discord Profile List

A modern, responsive Discord user profile viewer built with Next.js 14 and TypeScript. Display Discord user profiles with real-time status updates, badges, and custom effects.

## Features

- Real-time Discord user status updates
- Profile cards with avatars and banners
- Discord badge system
- Custom profile effects
- Dark/Light theme support
- Responsive design
- Real-time search functionality
- Caching system for optimal performance

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ShadcnUI Components
- Framer Motion
- Discord API Integration

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Discord Bot Token with required permissions

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Dzgak/cool-ppl-list-discordstyle.git
   cd cool-ppl-list-discordstyle
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   ```bash
   cp dist.env .env
   ```
   Fill in your Discord credentials in `.env`:
   ```env
   DISCORD_BOT_TOKEN="your_bot_token"
   DISCORD_CLIENT_ID="your_client_id"
   DISCORD_CLIENT_SECRET="your_client_secret"
   DISCORD_REDIRECT_URI="http://localhost:3000/callback"
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to the Bot section
4. Enable required intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
5. Copy the bot token to your `.env` file

## Configuration

### User List

Edit `SAMPLE_USER_IDS` in `app/actions.ts` to display different users:

```typescript
const SAMPLE_USER_IDS = [
  "user_id_1",
  "user_id_2"
  // Add more user IDs
]
```

### Custom Badges

Configure custom badges in `app/actions.ts`:

```typescript
const CUSTOM_BADGES = {
  "user_id": "badge_type"
}
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Discord API Documentation
- Next.js Documentation
- ShadcnUI Components
- Framer Motion
