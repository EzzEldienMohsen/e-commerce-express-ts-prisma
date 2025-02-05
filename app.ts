import express from 'express';
import 'dotenv/config';
import {
  logOutRouter,
  loginRouter,
  productsRouter,
  signUpRouter,
} from './controllers';
const app = express();

app.use(express.json());
const port = process.env.PORT || 5000;

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/sign-up', signUpRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/logout', logOutRouter);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
