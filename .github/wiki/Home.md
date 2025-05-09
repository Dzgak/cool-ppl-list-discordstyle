# Cool People List - Discord Style

Welcome to the Cool People List wiki! This project displays Discord user profiles in a sleek, Discord-inspired interface.

## Features

- Real-time Discord user status display
- Profile cards with avatars and banners
- Badge system showing Discord badges
- Profile effects for special users
- Dark/Light theme support
- Responsive design
- Real-time search functionality

## Technical Details

The project is built using:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Discord API
- ShadcnUI Components
- Framer Motion

## API Integration

The application uses the Discord API to fetch:
- User profiles
- User presence status
- Server members (if guild ID is provided)
- User badges and decorations

## Getting Started

1. Clone the repository
2. Copy `dist.env` to `.env` and fill in your Discord bot credentials
3. Install dependencies with `npm install`
4. Run the development server with `npm run dev`

## Configuration

### Environment Variables

```env
DISCORD_BOT_TOKEN="your_bot_token"
DISCORD_CLIENT_ID="your_client_id"
DISCORD_CLIENT_SECRET="your_client_secret"
DISCORD_REDIRECT_URI="http://localhost:3000/callback"
```

### User List Configuration

Edit `SAMPLE_USER_IDS` in `app/actions.ts` to display different users.

### Permissions

Make sure your Discord bot has the following permissions:
- Read Messages/View Channels
- Server Members Intent
- Presence Intent
- Message Content Intent

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
