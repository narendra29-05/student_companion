FROM node:20-alpine

WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

EXPOSE 5000

# Using nodemon for development
CMD ["npm", "run", "dev"]