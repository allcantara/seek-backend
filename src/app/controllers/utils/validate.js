const Product = require('../../models/Product')
const User = require('../../models/User')
const Restaurant = require('../../models/Restaurant')
const devicesConfig = require('../../../config/devices.json')
const statusConfig = require('../../../config/status.json')

module.exports = {
    
    async validateFieldsStore (restaurantId, userId, device, productsList, priceTotal, payment, tableNumber, clientName) {
        if(!device)
            return { error: true, message: 'Não foi possível identificar o tipo de dispositivo!' }
      
        if(!restaurantId) 
          return { error: true, message: 'Não foi possível identificar o restaurante!' }
      
        if(!productsList || productsList.length === 0)
          return  { error: true, message: 'Não foi possível identificar os produtos!' }
      
        if(!payment)
          return { error: true, message: 'A forma de pagamento deve ser informada!' }
      
        if(!priceTotal || priceTotal === 0) 
          return { error: true, message: 'O total da compra não foi informado!' }
      
        if(device === devicesConfig.APP) {
          if(!userId || userId === "")
            return { error: true, message: 'Não foi possível identificar o usuário da compra!' }
      
          if(!await User.findById(userId))
            return { error: true, message: 'Este usuário não existe!' }
        }
      
        if(device === devicesConfig.WEB) {
          if(!tableNumber) return { error: true, message: 'Por favor, informe o número da mesa!' }
          if(!clientName) return { error: true, message: 'Por favor, informe seu nome!' }
        }
      
        if(!await Restaurant.findById(restaurantId))
          return { error: true, message: 'Este restaurante não existe!' }
      
        productsList.map(async product => {
          const { item: itemId } = product
          if(!await Product.findById(itemId))
            return { error: true, message: 'Algum dos produtos informado não possui cadastro!' }
        })

        return { error: false }
    },

    validadePurchaseAfterOrder(purchase) {
      if(purchase.status === statusConfig.FINISHED) 
        return { isValid: false, message: 'Este pedido foi finalizado!' }

      if(purchase.status === statusConfig.CANCELED) 
        return { isValid: false, message: 'Este pedido foi cancelado!' }

      return { isValid: true }
    },


}