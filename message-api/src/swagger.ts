import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { PORT } from "./utils/vars";
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
            title: 'MotoGuard WhatsApp API',
            version: '1.0.0',
            description: 'Documentação da API de envio de alertas por WhatsApp',
          },
          servers: [
            {
              url: `http://localhost:${PORT}`,
            },
          ],
        },
        apis: ['./**/*.ts'], // files containing annotations as above
      }
      this.swaggerDocs = swaggerJsDoc(this.swaggerOptions);
    }

    public routers(){
        this.router.use('', swaggerUi.serve, swaggerUi.setup(this.swaggerDocs));
        return this.router
    }
}