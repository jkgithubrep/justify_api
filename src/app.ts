import "reflect-metadata";
import express from "express";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(express.json());
app.use(express.text());

app.set("port", process.env.PORT || 3000);

app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

export default app;
