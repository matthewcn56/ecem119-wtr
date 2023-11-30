# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.18.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Next.js"

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY --link . .

# Set env vars
ENV NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDjGU8p21MRiwqrgWZs6Org2nuZXDgh1W0"
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="m119-wtr.firebaseapp.com"
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID="m119-wtr"
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="m119-wtr.appspot.com"
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="7479906737"
ENV NEXT_PUBLIC_FIREBASE_APP_ID="1:7479906737:web:2b2a84d300cca6baa46d90"
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-PV1G8RBK9J"
ENV NEXT_PUBLIC_FIREBASE_RTD_URL="https://m119-wtr-default-rtdb.firebaseio.com/"

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
