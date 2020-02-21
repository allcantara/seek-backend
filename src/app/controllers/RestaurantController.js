// @ts-nocheck
const crypto = require("crypto");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const Product = require("../models/Product");
const typeUser = require("../../config/typeUser.json");

module.exports = {
  async store(req, res) {
    try {
      const { filename } = req.file;
      if(!filename)
        return res.status(401).send({ message: "A foto é obrigatória!" });

      const {
        user: id,
        name,
        addressName,
        addressNumber,
        addressCity,
        addressCep
      } = req.body;

      if (!id || !name || !addressName || !addressNumber || !addressCity || !addressCep)
        return res.status(401).send({ message: "Todos os campos são obrigatórios!" });

      const userRec = await User.findById(id).select("+typeUser");

      if (!userRec)
        return res
          .status(401)
          .send({ message: "Um usuário existente deve ser vinculado!" });

      if (userRec.typeUser !== typeUser.ADMIN)
        return res.status(401).send({
          message: "Este usuário não tem permissão para ser vinculado!"
        });

      if (await Restaurant.findOne({ name }))
        return res
          .status(401)
          .send({ message: "Já existe um restaurante com este nome!" });
      
      const data = req.body;
      data.image = filename;

      const restaurant = await Restaurant.create(req.body);

      return res.status(200).send(restaurant);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async update(req, res) {
    try {
      const { filename } = req.file;
      const {
        name,
        addressName,
        addressNumber,
        addressCity,
        addressCep
      } = req.body;

      if (
        !name ||
        !addressName ||
        !addressNumber ||
        !addressCity ||
        !addressCep
      )
        return res
          .status(401)
          .send({ message: "Todos os campos são obrigatórios!" });

      if (!(await Restaurant.findById(req.params.id)))
        return res
          .status(401)
          .send({ message: "Este restaurante não existe!" });
      
      const data = req.body;
      data.image = data.image !== filename ? filename : data.image;
      const restaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        {
          ...data,
          updatedAt: Date.now()
        },
        { new: true }
      );

      return res.status(200).send(restaurant);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!(await Restaurant.findById(id)))
        return res
          .status(400)
          .send({ message: "Este restaurante não existe!" });

      await Restaurant.findByIdAndRemove(id);

      return res
        .status(200)
        .send({ message: "Registro deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await Restaurant.findById(id).populate("user"); // EAGER

      if (!restaurant)
        return res
          .status(400)
          .send({ message: "Este restaurante não existe!" });

      return res.status(200).send(restaurant);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async index(req, res) {
    try {
      const restaurants = await Restaurant.find();

      return res.status(200).send(restaurants);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async indexProducts(req, res) {
    try {
      const { id: restaurant } = req.params;
      const products = await Product.find({ restaurant });

      return res.status(200).send(products);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async showRestaurantInUser(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await Restaurant.findOne({ user: id })

      if (!restaurant)
        return res
          .status(202)
          .send({ message: "Este restaurante não existe!" });

      return res.status(200).send(restaurant);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  }
};
