import express from "express";
import productRouter from "./productRouter";
import { Router } from "express";
import fs from "fs";
import cartRouter from "./cartRouter";


const app = express();
const PORT = 8080;
const router = Router();

app.use(express.json());
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


const getProductsFromJSON = () => {
  const data = fs.readFileSync("productManager.json", "utf8");
  return JSON.parse(data);
};

const saveProductsToJSON = (products) => {
  fs.writeFileSync("productManager.json", JSON.stringify(products));
};

let products = getProductsFromJSON();

const generateId = () => {
  return products.length === 0 ? 1 : products[products.length - 1].id + 1;
};

/*
let product = [
  {
    id: 1,
    title: "Top Loly",
    description: 'Top negro talle unico',
    price: 3500,
    code: "123",
    stock: 2,
    thumbnail: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1624963064-zara-cropped-top-negro-1624963028.jpg?crop=1xw:1xh;center,top&resize=480%3A%2A',
    category: "ropa",
    status: true,
  },
  {
    id: 2,
    title: "Top Luna",
    description: 'Top verde talle unico',
    price: 3000,
    code: "124",
    stock: 3,
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZcGzMP7UT8zw8zJ2SkaOWJ2CNgZjPFZYQwA&usqp=CAU',
    category: "ropa",
    status: true,
  },
  {
    id: 3,
    title: "Top Bimba",
    description: 'Top rosa talle unico',
    price: 4000,
    code: "125",
    stock: 2,
    thumbnail: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/top-zara-1616859543.jpg?resize=480:*',
    category: "ropa",
    status: true,
  },
];*/


router.get("/", (req, res) => {
  const { limit } = req.query;
  let result = products;
  
  if (limit) {
    result = products.slice(0, Number(limit));
  }

  res.status(200).json(result);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.status(200).json(product);
});

router.post("/", (req, res) => {
  const { title, description, price, code, stock, category, thumbnails } = req.body;
  const id = generateId();

  const newProduct = {
    id,
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
    status: true,
  };

  products.push(newProduct);
  saveProductsToJSON(products);

  res.status(201).json({ message: `Producto agregado: ${id}` });
});

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const productIndex = products.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  products[productIndex] = { ...products[productIndex], ...data };
  saveProductsToJSON(products);

  res.status(200).json({ message: `Producto actualizado: ${id}` });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;
  products = products.filter(item => item.id !== id);
  if (products.length === initialLength) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json({ message: `Producto eliminado = ${id}` });
});

export default router;

