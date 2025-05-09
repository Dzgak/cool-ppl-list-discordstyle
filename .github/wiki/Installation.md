# Installation Guide

This guide will help you set up the Cool People List project locally.

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- A Discord Bot Token
- Git

## Step-by-Step Installation

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
   Edit `.env` with your Discord credentials.

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the Bot section
4. Enable required intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
5. Copy the bot token to your `.env` file

## Troubleshooting

Common issues and solutions:

### API Errors
- Ensure your bot token is correct
- Check if all required intents are enabled
- Verify bot has correct permissions

### Build Errors
- Clear `.next` directory
- Remove `node_modules` and reinstall
- Ensure Node.js version is compatible
