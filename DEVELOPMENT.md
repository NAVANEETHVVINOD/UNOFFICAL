# Development Guidelines and Technical Specifications

## Project Structure

### Backend (NestJS)
```
apps/server/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   └── [feature]/
│   │       ├── dto/
│   │       ├── entities/
│   │       ├── interfaces/
│   │       └── [feature files]
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interfaces/
│   │   ├── middleware/
│   │   └── utils/
│   └── config/
└── test/
```

### Frontend (Next.js)
```
apps/web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   │   ├── clubs/
│   │   │   ├── events/
│   │   │   └── [feature]/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   └── [feature]/
│   ├── hooks/
│   ├── lib/
│   └── styles/
└── public/
```

### Mobile (React Native)
```
apps/mobile/
├── src/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── services/
│   ├── hooks/
│   └── utils/
└── assets/
```

## Database Schema (Prisma)

### Core Models
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  studentId     String?   @unique
  password      String
  role          Role      @default(STUDENT)
  status        UserStatus @default(PENDING)
  profile       Profile?
  clubs         ClubMember[]
  posts         Post[]
  events        EventParticipation[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Profile {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  fullName      String
  department    String
  year          Int
  cgpa          Float?
  bio           String?   @db.Text
  avatar        String?
  socialLinks   Json?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Club {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String    @db.Text
  logo          String?
  category      String
  members       ClubMember[]
  events        Event[]
  posts         Post[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## API Endpoints

### Authentication
```typescript
// POST /api/auth/register
interface RegisterDTO {
  email: string;
  password: string;
  studentId: string;
  fullName: string;
  department: string;
  year: number;
}

// POST /api/auth/login
interface LoginDTO {
  email: string;
  password: string;
}

// Response
interface AuthResponse {
  user: UserDTO;
  tokens: {
    access: string;
    refresh: string;
  };
}
```

### User Management
```typescript
// GET /api/users/me
interface UserDTO {
  id: string;
  email: string;
  role: Role;
  profile: ProfileDTO;
}

// PATCH /api/users/me
interface UpdateUserDTO {
  fullName?: string;
  department?: string;
  year?: number;
  bio?: string;
  avatar?: string;
  socialLinks?: SocialLinksDTO;
}
```

## State Management

### Frontend (Zustand)
```typescript
interface AuthStore {
  user: User | null;
  tokens: Tokens | null;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

## Error Handling

### Backend Errors
```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
  }
}

// Error Response Format
interface ErrorResponse {
  statusCode: number;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
  path: string;
}
```

## Testing Standards

### Unit Tests
```typescript
// Component Testing (React)
describe('Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Expected Text')).toBeInTheDocument();
  });
});

// Service Testing (NestJS)
describe('Service', () => {
  it('performs operation correctly', async () => {
    const result = await service.operation();
    expect(result).toBeDefined();
  });
});
```

## Security Implementation

### Authentication Flow
```typescript
// JWT Payload
interface JWTPayload {
  sub: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

// Token Service
interface TokenService {
  generateTokens(user: User): Promise<Tokens>;
  verifyToken(token: string): Promise<JWTPayload>;
  refreshToken(token: string): Promise<Tokens>;
}
```

## Performance Optimization

### Caching Strategy
```typescript
// Cache Keys
enum CacheKey {
  USER_PROFILE = 'user:profile:',
  CLUB_DETAILS = 'club:details:',
  EVENT_LIST = 'event:list',
  STUDY_MATERIALS = 'study:materials:'
}

// Cache TTL (in seconds)
const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 3600,  // 1 hour
  LONG: 86400,   // 1 day
};
```

## Deployment Configuration

### Environment Variables
```typescript
// Backend
interface ServerConfig {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REDIS_URL?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_S3_BUCKET?: string;
}

// Frontend
interface ClientConfig {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_SOCKET_URL: string;
  NEXT_PUBLIC_GA_ID?: string;
}
```

## Monitoring and Logging

### Log Format
```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  context: string;
  message: string;
  metadata?: Record<string, any>;
  trace?: string;
}
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
      - name: Run tests
      - name: Run linting
      - name: Build packages

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
```

## Code Review Guidelines

### Pull Request Template
```markdown
## Description
[Description of the changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```