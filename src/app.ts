import express from "express";

const app = express();

app.use(express.json());
app.use(express.text());

app.set("port", process.env.PORT || 3000);

export default app;
