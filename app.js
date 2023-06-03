import express from 'express';
import fs from 'fs';
import productRouter from './Routers/product.router.js'
import cartRouter from "./cartRouter";


const app = express();
app.use(express.json())
const PORT = 8080;

app.get('/', (req, res) => {
  res.send('<h1>Bienvenida a LOLA clothes</h1>');
});

app.use('/product', productRouter)
app.use("/api/carts", cartRouter);



app.get('/product', async (req, res) => {
  console.log('Solicitud recibida');
  await productManager.getProduct();
  const products = productManager.products;
  
 
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    res.send(products.slice(0, limit));
  } else {
    res.send(products);
  }
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  const product = productManager.getProductById(id);
  if (product === 'producto no encontrado') {
    res.send({ error: 'Producto no encontrado' });
  } else {
    res.send(product);
  }
});

app.listen(8080, () => console.log('Server up'));
