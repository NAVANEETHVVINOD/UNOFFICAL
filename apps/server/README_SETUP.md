# Linker Backend Setup Guide

## 1. Backend Status
The backend implementation is complete. The following modules are ready:
- **Auth**: JWT-based authentication (Login, Register, Refresh Token).
- **Users & Profiles**: User management and profile updates.
- **Colleges**: Listing and retrieving colleges.
- **Clubs**: Club management and membership.
- **Events**: Event creation, listing, and RSVP.
- **Marketplace**: Buying and selling listings.
- **Notes**: Uploading and sharing study notes.

## 2. Connecting to Supabase
To connect your backend to Supabase, follow these steps:

### Step 1: Get Connection String
1. Go to your Supabase Project Dashboard.
2. Navigate to **Project Settings** -> **Database**.
3. Under **Connection parameters**, find the **URI**.
4. It usually looks like this: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual database password.
   - Replace `[PROJECT-REF]` with your project reference ID.

### Step 2: Update Environment Variables
1. Open `apps/server/.env`.
2. Update the `DATABASE_URL` variable with your Supabase connection string.

```env
DATABASE_URL="postgresql://postgres:yourpassword@db.yourproject.supabase.co:5432/postgres"
```

### Step 3: Push Schema to Database
Run the following command in the `apps/server` directory to create the tables in your Supabase database:

```bash
npx prisma db push
```

### Step 4: Seed the Database (Optional)
If you want to add some initial data, you can create a seed script or manually add data via Supabase Table Editor.

## 3. Running the Server
Start the backend server:

```bash
# In apps/server
npm run start:dev
```

The server will start on `http://localhost:4000`.

## 4. Frontend Integration
The frontend is located in `apps/web`. You will need to:
1. Update `apps/web/.env` (or `.env.local`) to point `NEXT_PUBLIC_API_URL` to `http://localhost:4000`.
2. Ensure the frontend makes requests to this URL.
