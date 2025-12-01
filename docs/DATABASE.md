# Database Setup

1. Install PostgreSQL:
   - Download PostgreSQL from https://www.postgresql.org/download/windows/
   - During installation:
     - Remember the password you set for the `postgres` user
     - Keep the default port (5432)
     - Install all components when prompted

2. Create Database:

   ```sql
   CREATE DATABASE college_connect;
   ```

3. Configure Environment:
   - Create a `.env` file in the server directory with:

   ```
   DATABASE_URL="postgresql://postgres:your-password@localhost:5432/college_connect?schema=public"
   ```

   Replace `your-password` with the password you set during PostgreSQL installation.

4. Run Migrations:

   ```bash
   cd apps/server
   npx prisma migrate dev --name init
   ```

5. Seed Initial Data (Optional):
   ```bash
   cd apps/server
   npx prisma db seed
   ```
