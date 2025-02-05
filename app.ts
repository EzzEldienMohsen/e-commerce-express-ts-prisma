import express from 'express';
import 'dotenv/config';
import {
  addressRouter,
  logOutRouter,
  loginRouter,
  productsRouter,
  profileRouter,
  signUpRouter,
} from './controllers';
const app = express();

app.use(express.json());
const port = process.env.PORT || 5000;

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/sign-up', signUpRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/logout', logOutRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/address', addressRouter);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
