import { Router } from "express";
import fs from "fs";

const cartRouter = Router();

const getCartsFromJSON = () => {
  const data = fs.readFileSync("cart.json", "utf8");
  return JSON.parse(data);
};

const saveCartsToJSON = (carts) => {
  fs.writeFileSync("cart.json", JSON.stringify(carts));
};

let carts = getCartsFromJSON();

const generateId = () => {
  return carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
};

cartRouter.get("/", (req, res) => {
  res.status(200).json(carts);
});

cartRouter.post("/", (req, res) => {
  const id = generateId();
  const newCart = {
    id,
    products: [],
  };

  carts.push(newCart);
  saveCartsToJSON(carts);
  res.status(201).json({ message: `Carrito creado: ${id}` });
});

cartRouter.get("/:cid", (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = carts.find((item) => item.id === cid);

  if (!cart) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  res.status(200).json(cart.products);
});

cartRouter.post("/:cid/product/:pid", (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const quantity = req.body.quantity;

  const cartIndex = carts.findIndex((item) => item.id === cid);

  if (cartIndex === -1) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  const cart = carts[cartIndex];
  const existingProduct = cart.products.find((item) => item.product === pid);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ product: pid, quantity });
  }

  saveCartsToJSON(carts);
  res.status(201).json({ message: "Producto agregado al carrito correctamente" });
});

export default cartRouter;
