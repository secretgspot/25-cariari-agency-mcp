# Use a lightweight Node.js base image suitable for TypeScript
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# This allows Docker to cache the npm install step efficiently
COPY package*.json ./

# Install production dependencies
# 'tsx' is a dev dependency, but we need it at runtime.
# If 'tsx' is only in devDependencies, 'npm install --production' won't install it.
# To ensure it's available, you have a few options:
# Option A: Make tsx a regular dependency (less common for a runtime like tsx)
# Option B: Install tsx globally (as shown below, good for Dockerfiles)
# Option C: Use 'npm install' without --production, then prune devDependencies later (more complex)
# Option D: Rely on npx to find it from node_modules, even if devDependency.
# For simplicity in this case, installing it globally or ensuring it's in regular dependencies is common.
RUN npm install --production --location=global tsx
# If you make 'tsx' a regular dependency in package.json:
# RUN npm install --production

# Copy the rest of your application code
# This includes your 'main.ts' and any other source files
COPY . .

# Command to run your MCP server using the 'start' script
# This is the preferred way to run Node.js apps in Docker
CMD [ "npm", "start" ]