import express from 'express';
import 'dotenv/config';
import {
  addressRouter,
  contactRouter,
  logOutRouter,
  loginRouter,
  productsRouter,
  profileRouter,
  signUpRouter,
  wishlistRouter,
} from './controllers';
import notFound from './utils/not-found';
const app = express();

app.use(express.json());
const port = process.env.PORT || 5000;

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/sign-up', signUpRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/logout', logOutRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/address', addressRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/contact', contactRouter);

// not found module
app.use(notFound);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
