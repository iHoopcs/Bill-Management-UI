# 1. Use an official Node.js runtime as a parent image
FROM node:22-alpine

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY bill-management-ui/package*.json ./
RUN npm install

# 4. Copy the rest of the application code
COPY bill-management-ui/ .

# 5. Expose the port Expo web runs on
EXPOSE 8081

# 6. Start the app in web mode
CMD ["npx", "expo", "start", "--web", "--port", "8081"]