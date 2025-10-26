/backend
│  server.js
│  .env
│  package.json
│
├── config
│   ├── db.js
│   └── oauthConfig.js
│
├── models
│   ├── User.js
│   ├── Post.js
│   └── SocialAccount.js
│
├── controllers
│   ├── authController.js
│   ├── postsController.js
│   └── socialController.js
│
├── routes
│   ├── authRoutes.js
│   ├── postRoutes.js
│   └── socialRoutes.js
│
├── middleware
│   ├── authMiddleware.js
│   └── errorHandler.js
│
└── utils
    └── jwt.js

    
✔️ Summary

We built a structure that uses separate folders for config, models, controllers, routes, middleware, utils.

Authentication (registration, login, logout) with hashed password and JWT.

CRUD endpoints for posts, restricted to authenticated user and only their posts.

Social media account connection endpoints via OAuth, saving platform credentials.

Environment variables for secrets/configs.

Authentication middleware and error handler.