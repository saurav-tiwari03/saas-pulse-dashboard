import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Analytic Tool API",
      version: "1.0.0",
      description: "Backend API for managing frontend store and admin dashboard",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5005",
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
              example: "clx1234567890",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
              example: "user@example.com",
            },
            name: {
              type: "string",
              description: "User name",
              example: "John Doe",
            },
            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              description: "User role",
              example: "USER",
            },
            isActive: {
              type: "boolean",
              description: "User active status",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        CreateUserInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email",
              example: "newuser@example.com",
            },
            name: {
              type: "string",
              description: "User name",
              example: "John Doe",
            },
            password: {
              type: "string",
              minLength: 8,
              description: "User password",
              example: "securePassword123",
            },
          },
        },
        UpdateUserInput: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email",
              example: "updated@example.com",
            },
            name: {
              type: "string",
              description: "User name",
              example: "Jane Doe",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            code: {
              type: "integer",
              description: "HTTP status code",
              example: 400,
            },
            message: {
              type: "string",
              description: "Error message",
              example: "User not found!",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
    ],
  },
  apis: [
    "./src/routes/**/*.ts",
    "./src/controllers/**/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
