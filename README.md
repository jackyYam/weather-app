# 🌤️ Simple Weather App

A modern, responsive weather application built with React, TypeScript, and Tailwind CSS. Get real-time weather information for cities worldwide with an intuitive interface and powerful features.

## ✨ Features

### 🔍 **Global City Search**

- **20,000+ Cities**: Search from a comprehensive database of cities worldwide, obtained from https://www.weatherbit.io/api/meta
- **Debounced Search**: Debounced search with real-time results
- **Smart Filtering**: Search by city name or country
- **Keyboard Navigation**: Use arrow keys and Enter to navigate search results
- **Persistent Favorites**: Selected cities are automatically saved to your favorites

### 📍 **Current Location**

- **Automatic Detection**: Get weather for your current location usig
- **Geolocation API**: Uses browser's built-in location services

### 🔄 **Refresh & Sync**

- **Manual Refresh**: Refresh button in header to update all weather data
- **Auto-Sync**: Smart caching with React Query for optimal performance

### 🌙 **Dark/Light Theme**

### 🌍 **Timezone Support**

- **Local Time Display**: Shows current time in each city's timezone
- **Accurate Forecasts**: Hourly forecasts display in local time

### 📱 **Responsive Design**

### 📊 **Comprehensive Weather Data**

- **Current Conditions**: Temperature, humidity, wind speed, cloud coverage
- **Feels Like**: Real feel temperature with weather conditions
- **Min/Max Temps**: Daily temperature range
- **Weather Icons**: Visual weather condition indicators
- **Hourly Forecast**: Next 24 hours in 3-hour intervals
- **5-Day Forecast**: Extended forecast with daily summaries

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Add your OpenWeatherMap API key to `.env`:

   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:5173` to see the app

## 🛠️ Tech Stack

### Core Technologies

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling

### Key Libraries

- **@tanstack/react-query**: Data fetching, caching, and synchronization
- **Lucide React**: Beautiful icon library

### APIs & Data

- **OpenWeatherMap API**: Real-time weather data and forecasts
- **City Database**: 20,000+ cities from comprehensive CSV dataset
- **Geolocation API**: Browser-based location detection

## 📱 Usage

### Basic Usage

1. **View Default Cities**: App starts with Rio de Janeiro, Beijing, and Los Angeles
2. **Switch Cities**: Click on city tabs to view different locations
3. **Check Details**: View current weather, hourly, and daily forecasts

### Search for Cities

1. **Open Search**: Click the search icon in the header
2. **Type City Name**: Enter at least 2 characters
3. **Select City**: Click on a result or use keyboard navigation
4. **Auto-Save**: City is added to your favorites with a star icon

### Current Location

1. **Enable Location**: Click the button in the search dialog, allow browser location access when prompted
2. **Automatic Weather**: Get weather for your current position
3. **Location Updates**: Refresh location manually when needed

### Theme Switching

1. **Toggle Theme**: Click the sun/moon icon in the header
2. **Persistent Setting**: Your preference is automatically saved
3. **System Sync**: Respects your device's dark/light mode setting

### Managing Favorites

1. **Add Cities**: Search and select cities to add to favorites
2. **Remove Cities**: Hover over favorite cities and click the X button
3. **Star Indicators**: Favorite cities show a star icon
4. **Protected Defaults**: Default cities cannot be removed

## 🔧 Configuration

### Environment Variables

```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

### API Configuration

The app uses OpenWeatherMap API with the following endpoints:

- Current weather data
- 5-day/3-hour forecast
- City search and geocoding

### Customization

- **Default Cities**: Modify in `src/App.tsx`
- **Theme Colors**: Customize in `src/index.css`
- **API Settings**: Configure in `src/api/config.ts`
