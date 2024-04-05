import express from "express";

const app = express();
const port = 3000;

app.get("/", (_, res) => {
  res.send("Example typescript and express");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
