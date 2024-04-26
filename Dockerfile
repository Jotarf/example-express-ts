# Base Node
FROM node:lts-alpine AS base
WORKDIR /app
COPY ["package*.json", "./"]

# Install all (development and production) dependencies
FROM base as dependencies
RUN npm ci --no-fund --no-audit --silent

# Serve app as development
FROM dependencies AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
RUN npx prisma generate
CMD ["npm", "run", "start:dev-docker"]

# Build app
FROM dependencies AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Serve app as production
FROM base AS production
# Install production dependencies
RUN npm ci --only=production --no-fund --no-audit --silent
# Copy prisma generated schema from build stage
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
# Copy built application from build stage
COPY --from=build /app/dist ./dist
# Change ownership to node user
RUN chown -R node /app
USER node
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/src/server.js"]
