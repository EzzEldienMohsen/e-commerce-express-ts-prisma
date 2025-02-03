import express from 'express';
import 'dotenv/config';
const app = express();

app.use(express.json());
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
