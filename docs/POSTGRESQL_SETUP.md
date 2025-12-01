# PostgreSQL Installation and Setup Guide

## Windows Installation

1. Download PostgreSQL:
   - Go to https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Download PostgreSQL 16.x for Windows x86-64
   - Run the installer

2. Installation Steps:
   - Select components to install:
     - [x] PostgreSQL Server
     - [x] pgAdmin 4
     - [x] Command Line Tools
     - [x] Stack Builder
   - Choose installation directory (default is fine)
   - Set password for database superuser (postgres): `postgres`
   - Set port number: 5432 (default)
   - Choose locale (default is fine)

3. After Installation:
   - Open pgAdmin 4
   - Right-click on "Servers" → "Register" → "Server..."
   - Enter these details:
     - Name: `localhost`
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: `postgres`

4. Create Database:
   - Right-click on "Databases"
   - Select "Create" → "Database..."
   - Enter database name: `college_connect`
   - Click "Save"

## Verify Installation

1. Open Command Prompt or PowerShell
2. Run these commands:

   ```powershell
   # Connect to database
   psql -U postgres -d college_connect

   # You should see a prompt like: college_connect=#
   # Type \q to exit
   ```

## Next Steps

After successful installation:

1. Run database migrations:

   ```bash
   cd apps/server
   npx prisma migrate dev --name init
   ```

2. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

3. Seed initial data:

   ```bash
   npm run prisma:seed
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```
