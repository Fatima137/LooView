
# LooView - Firebase Studio

This is a NextJS starter in Firebase Studio for the LooView app.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

### Prerequisites

- Node.js and npm/yarn installed.
- A Google Maps API key.
- Firebase project configured with Authentication and Firestore.

### Setup

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**

    Create a `.env.local` file in the root of your project and add your Google Maps API key and Firebase configuration:

    ```env
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_HERE"

    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
    ```
    Replace the placeholder values with your actual keys and configuration details from your Firebase project console and Google Cloud Console.
    - For Google Maps: Enable the "Maps JavaScript API" and "Places API" in your Google Cloud Console.
    - For Firebase: Ensure you have created a Web App in your Firebase project settings and copy the configuration values. Enable Firestore and Firebase Authentication (e.g., Email/Password).

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be available at `http://localhost:9002` (or the port specified in your `package.json` dev script).

## Core Features:

- Add Toilet: Allow users to add toilets to the map with location, name, and photo.
- Upload Photos: Enable users to upload photos of the toilet to show its condition.
- Rate & Review: Allow users to rate and review toilets based on their experience.
- Tag Features: Enable users to tag features like accessibility, baby-friendly amenities, and availability of toilet paper.
- Browse Nearby: Display nearby toilets on a map for easy discovery.

## Style Guidelines:

- Primary color: Clean white and light grey to represent cleanliness.
- Secondary color: Light blue to give a sense of hygiene.
- Accent: Golden yellow for the 'Add Toilet' button to make it stand out.
- Clear, readable sans-serif fonts for easy information scanning.
- Simple and intuitive icons for features and amenities.
- Clean and organized layout with a focus on map integration.

# LooView_
