import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import express from "express";

export class Swagger{
    private router = express.Router();
    private swaggerOptions;
    private swaggerDocs;

    public constructor(){
      this.swaggerOptions = {
        swaggerDefinition: {
          openapi: '3.0.0',
          info: {
            title: 'MotoGuard Backend API',
            version: '1.0.0',
            description: 'Documentação da API do backend do MotoGuard',
          },
          components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
        },
        apis: ['./**/*.ts'],
      }
      this.swaggerDocs = swaggerJsDoc(this.swaggerOptions);
    }

    public routers(){
        const options = {
            customSiteTitle: "MotoGuard Backend API",
        };
        this.router.use('', swaggerUi.serve, swaggerUi.setup(this.swaggerDocs, options));
        return this.router
    }
}