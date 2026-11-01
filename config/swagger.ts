import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bank API",
      version: "1.0.0",
      description: "Documentación de la API REST",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./**/*.ts"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
