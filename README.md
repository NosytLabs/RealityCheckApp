# RealityCheck

A React Native app for digital wellness and screen time management with features like focus mode, app usage limits, scheduled downtime, and parental controls.

## Features

- **Focus Mode**: Minimize distractions during important tasks
- **App Usage Limits**: Set daily time limits for specific applications
- **Scheduled Downtime**: Schedule regular device breaks
- **Parental Controls**: Monitor and control children's device usage
- **Screen Time Analytics**: Track and analyze usage patterns
- **Mindful Interventions**: AI-powered suggestions for healthier device usage
- **Progress Tracking**: Monitor your digital wellness journey

## Tech Stack

- **Framework**: React Native with Expo
- **Backend**: Supabase
- **Navigation**: React Navigation
- **State Management**: React Query + Context API
- **Styling**: React Native StyleSheet
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NosytLabs/RealityCheck.git
cd RealityCheck
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Fill in your Supabase credentials and other required environment variables.

4. Start the development server:
```bash
npm start
```

### Running on Devices

- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/       # API and business logic
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── styles/         # Theme and styling
└── config/         # App configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@nosytlabs.com or open an issue on GitHub.