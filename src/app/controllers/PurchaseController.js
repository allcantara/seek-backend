// @ts-nocheck
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const ItemPurchase = require("../models/ItemPurchase");
const devicesConfig = require("../../config/devices.json");

const statusConfig = require("../../config/status.json");

const {
  validateFieldsStore,
  validadePurchaseAfterOrder
} = require("./utils/validate");
const { generateCode } = require("./utils/genetareCode");

module.exports = {
  async store(req, res) {
    try {
      let products = [];
      const code = generateCode(4);
      const {
        restaurant: restaurantId,
        products: productsList,
        user: userId,
        device,
        priceTotal,
        payment,
        tableNumber,
        clientName
      } = req.body;

      const valid = await validateFieldsStore(
        restaurantId,
        userId,
        device,
        productsList,
        priceTotal,
        payment,
        tableNumber,
        clientName
      );
      if (valid.error)
        return res.status(202).send({ error: valid.error, message: valid.message });

      await Promise.all(
        productsList.map(async prod => {
          const { item: product, amount } = prod;
          const itemPurchase = new ItemPurchase({
            product,
            amount,
            code: String(code)
          });
          await itemPurchase.save();
          products.push(itemPurchase._id);
        })
      );

      const data = {
        restaurant: restaurantId,
        user: device === devicesConfig.APP ? userId : null,
        device,
        priceTotal,
        payment,
        tableNumber,
        clientName,
        code: String(code),
        status: statusConfig.PROGRESS,
        products
      };

      const purchase = await Purchase.create(data);
      return res.status(200).send(purchase);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async update(req, res) {
    try {
      let products = [];
      const { id: purchaseId } = req.params;

      const {
        restaurant: restaurantId,
        user: userId,
        device,
        products: productsList,
        priceTotal,
        payment,
        tableNumber,
        clientName
      } = req.body;

      const valid = await validateFieldsStore(
        restaurantId,
        userId,
        device,
        productsList,
        priceTotal,
        payment,
        tableNumber,
        clientName
      );

      if (valid.error)
        return res.status(202).send({ error: valid.error, message: valid.message });

      const purchase = await Purchase.findById(purchaseId).populate("products");

      if (!purchase)
        return res.status(202).send({ message: "Esta compra não foi cadastrada!" });

      const validatePurchase = validadePurchaseAfterOrder(purchase);
      if (!validatePurchase.isValid)
        return res.status(202).send({ message: validatePurchase.message });

      purchase.products = [];

      await Promise.all(
        productsList.map(async prod => {
          const { item: product, amount } = prod;
          const { code } = purchase;
          await ItemPurchase.deleteMany({ code });
          const itemPurchase = new ItemPurchase({ product, amount, code });
          await itemPurchase.save();
          products.push(itemPurchase._id);
        })
      );

      const data = {
        restaurant: restaurantId,
        user: device === devicesConfig.APP ? userId : null,
        device,
        priceTotal,
        payment,
        tableNumber,
        clientName,
        status: statusConfig.PROGRESS,
        products,
        updatedAt: Date.now()
      };

      const newPurchase = await Purchase.findByIdAndUpdate(
        purchaseId,
        {
          ...data
        },
        { new: true }
      );

      return res.status(200).send(newPurchase);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const purchase = await Purchase.findById(id).populate(["products"]);

      if (!purchase)
        return res.status(202).send({ message: "Esta compra não existe!" });

      await Promise.all(
        purchase.products.map(async item => {
          const { product: productId } = item;
          const prod = await Product.findById(productId);
          const ingredient = prod.ingredients.join(", ");
          prod.ingredients = ingredient;
          item.product = prod;
        })
      );

      return res.status(200).send(purchase);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async index(req, res) {
    try {
      const purchases = await Purchase.find().populate(["restaurant", "user"]);
      return res.status(200).send(purchases);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async cancel(req, res) {
    try {
      const { id } = req.params;
      const purchase = await Purchase.findById(id);
      if (!purchase)
        return res.status(202).send({ message: "Esta compra não esta cadastrada!" });

      const validatePurchase = validadePurchaseAfterOrder(purchase);
      if (!validatePurchase.isValid)
        return res.status(202).send({ message: validatePurchase.message });

      await Purchase.findByIdAndUpdate(id, {
        status: statusConfig.CANCELED
      });

      return res.status(200).send({ message: "Registro cancelado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async finish(req, res) {
    try {
      const { id } = req.params;
      const purchase = await Purchase.findById(id);
      if (!purchase)
        return res.status(202).send({ message: "Esta compra não esta cadastrada!" });

      const validatePurchase = validadePurchaseAfterOrder(purchase);

      if (!validatePurchase.isValid)
        return res.status(202).send({ message: validatePurchase.message });

      await Purchase.findByIdAndUpdate(id, {
        status: statusConfig.FINISHED
      });

      return res.status(200).send({ message: "Registro finalizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  },

  async delay(req, res) {
    try {
      const { id } = req.params;
      const { delay } = req.body;
      const purchase = await Purchase.findById(id);
      
      if (!purchase)
        return res.status(202).send({ message: "Esta compra não esta cadastrada!" });

      const validatePurchase = validadePurchaseAfterOrder(purchase);

      if (!validatePurchase.isValid)
        return res.status(202).send({ message: validatePurchase.message });

      if (purchase.status === statusConfig.DELAY)
        return res.status(202).send({ message: "O atraso já foi informado!" });

      const dateTimeDelay = new Date();
      dateTimeDelay.setMinutes(dateTimeDelay.getMinutes() + parseInt(delay));

      await Purchase.findByIdAndUpdate(id, {
        status: statusConfig.DELAY,
        delay: dateTimeDelay
      });

      return res.status(200).send({ message: "Atraso registrado!" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Falha na requisição!", error });
    }
  }
};
