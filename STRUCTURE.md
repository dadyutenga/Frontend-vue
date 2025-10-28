# Frontend Structure

```
src/
├── api/              # API services
│   ├── client.ts     # Axios instance with interceptors
│   ├── endpoints.ts  # API endpoint constants
│   ├── auth.ts       # Auth API calls
│   ├── documents.ts  # Document API calls
│   ├── folders.ts    # Folder API calls
│   ├── upload.ts     # Upload API calls
│   └── index.ts      # Export all
│
├── views/            # Page components
│   ├── LandingView.vue
│   ├── auth/
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── VerifyOTPView.vue
│   ├── dashboard/
│   │   └── DashboardView.vue
│   ├── documents/
│   │   ├── DocumentsView.vue
│   │   └── UploadView.vue
│   └── folders/
│       └── FoldersView.vue
│
├── components/       # Reusable components
│   ├── common/       # Buttons, inputs, modals
│   ├── layout/       # Header, sidebar, footer
│   └── features/     # Document cards, folder cards
│
├── composables/      # Composition API logic
│   ├── useAuth.ts
│   ├── useDocuments.ts
│   └── useFolders.ts
│
├── stores/           # Pinia stores
│   ├── auth.ts
│   ├── documents.ts
│   └── folders.ts
│
├── router/           # Vue Router
│   └── index.ts
│
├── types/            # TypeScript types
│   └── index.ts
│
├── utils/            # Helper functions
│   ├── format.ts
│   ├── validation.ts
│   └── index.ts
│
├── assets/           # Static assets
├── App.vue           # Root component
├── main.ts           # App entry point
└── style.css         # Global styles
```

## Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Register page
- `/verify-otp` - OTP verification
- `/dashboard` - Main dashboard (protected)
- `/documents` - Document list (protected)
- `/upload` - Upload document (protected)
- `/folders` - Folder management (protected)

## Next Steps

1. Install dependencies: `npm install` ✅
2. Create view components (empty templates)
3. Create reusable components
4. Create Pinia stores
5. Create composables
6. Implement authentication flow
7. Implement document management
8. Implement folder management
