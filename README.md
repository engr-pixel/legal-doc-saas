# Legal Doc SaaS - Pre-Legal Document Creation Platform

A comprehensive SaaS platform for creating pre-legal documents using customizable templates with user authentication, real-time collaboration, and deployment-ready Docker setup.

## Features

- ✅ User Authentication (JWT + OAuth2)
- ✅ Role-Based Access Control (Admin, Manager, User)
- ✅ Pre-built Legal Document Templates
- ✅ Real-time Document Editor
- ✅ PDF Export & Download
- ✅ Document Versioning
- ✅ Team Collaboration
- ✅ Payment Integration (Stripe)
- ✅ Docker & Docker Compose Setup
- ✅ Cloud-Ready Deployment

## Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma** ORM
- **JWT** authentication
- **Socket.io** for real-time features

### Frontend
- **React 18** with TypeScript
- **Redux** for state management
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hook Form** for forms

### DevOps
- **Docker** & Docker Compose
- **Nginx** reverse proxy
- **PM2** for process management

## Getting Started

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/engr-pixel/legal-doc-saas.git
   cd legal-doc-saas
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. **Setup database**
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm start
   ```

### Docker Deployment

```bash
# Build and start all services
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Project Structure

```
legal-doc-saas/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── utils/
│   │   └── app.ts
│   ├── prisma/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Documents
- `GET /api/documents` - List user documents
- `POST /api/documents` - Create new document
- `GET /api/documents/:id` - Get document details
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/export` - Export as PDF

### Templates
- `GET /api/templates` - List available templates
- `GET /api/templates/:id` - Get template details
- `POST /api/templates` - Create custom template (Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/team` - Get team members

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/legal_doc_saas
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_KEY=pk_test_...
```

## Deployment

### AWS Deployment
1. Push Docker image to ECR
2. Deploy with ECS/Fargate
3. Use RDS for PostgreSQL
4. CloudFront for CDN

### DigitalOcean Deployment
1. Build and push to Docker Hub
2. Deploy on App Platform
3. Use Managed Database

### Heroku Deployment
```bash
heroku create legal-doc-saas
heroku addons:create heroku-postgresql:standard-0
git push heroku main
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Contributing

Contributions are welcome! Please follow the coding standards and create pull requests to the `develop` branch.

## License

MIT License - see LICENSE file for details

## Support

For support, email: support@legaldocsaas.com
