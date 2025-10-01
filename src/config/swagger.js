const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Room Service API",
      version: "1.0.0",
      description: "API documentation for Meeting Room Service",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Development server"
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/routes/**/*.js"], // load docs từ routes
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
