import express from 'express';
import 'dotenv/config';
import { productsRouter } from './controllers';
const app = express();

app.use(express.json());
const port = process.env.PORT || 5000;

app.use('/api/v1/products', productsRouter);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
