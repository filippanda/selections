# Use the official Node.js base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --quiet

# Copy the React app code
COPY . .

# Build the React app
RUN npm run build

# Expose the React app port
EXPOSE 3000

# Run the React app
CMD ["npm", "start"]