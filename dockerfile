# Gunakan Node versi LTS
FROM node:20

# Tentukan working directory di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek
COPY . .

# Jalankan aplikasi
CMD ["npm", "run", "dev"]
