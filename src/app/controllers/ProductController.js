// @ts-nocheck
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");

module.exports = {
  async store(req, res) {
    try {
      const { filename } = req.file;
      const { restaurant: restaurantId, name, ingredients, price } = req.body;

      if (!restaurantId || !name || !ingredients || (!price && price <= 0))
        return res
          .status(401)
          .send({ message: "Todos os campos são obrigatórios!" });

      if (!(await Restaurant.findById(restaurantId)))
        return res
          .status(401)
          .send({ message: "Este restaurante não existe!" });

      const ingredientsList = ingredients.trim().split(", ");

      const data = {
        image: filename,
        restaurant: restaurantId,
        name,
        ingredients: ingredientsList,
        price
      };

      const product = await Product.create(data);

      return res.status(200).send(product);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async update(req, res) {
    try {
      const { filename } = req.file;
      const { name, ingredients, price } = req.body;

      if (!name || !ingredients || (!price && price <= 0))
        return res.status(401).send({ message: "Todos os campos são obrigatórios!" });

      const productExist = await Product.findById(req.params.id);
      if(!productExist)
        return res.status(401).send({ message: "Este produto não existe!" });

      const ingredientsList = ingredients.trim().split(", ");

      const data = {
        image: productExist.image !== filename ? filename : productExist.image,
        name,
        ingredients: ingredientsList,
        price,
        updatedAt: Date.now(),
      };

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { ...data }, { new: true }
      );

      return res.status(200).send(product);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!(await Product.findById(id)))
        return res.status(400).send({ message: "Este produto não existe!" });

      await Product.findByIdAndRemove(id);

      return res.status(200).send({ message: "Registro deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product)
        return res.status(400).send({ message: "Este produto não existe!" });

      const ingredients = product.ingredients.join(", ");
      product.ingredients = ingredients;

      return res.status(200).send(product);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async index(req, res) {
    try {
      const products = await Product.find();

      products.map(product => {
        const ingredients = product.ingredients.join(", ");
        product.ingredients = ingredients;
      });

      return res.status(200).send(products);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  }
};
