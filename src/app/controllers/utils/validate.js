const Product = require('../../models/Product')
const User = require('../../models/User')
const Restaurant = require('../../models/Restaurant')
const devicesConfig = require('../../../config/devices.json')

module.exports = {
    
    async validateFieldsStore (restaurantId,userId, device, productsList, priceTotal, payment, tableNumber, clientName) {
        if(!device)
            return { error: true, message: 'O tipo de dispositivo não foi informado!' }
      
        if(!restaurantId) 
          return { error: true, message: 'O ID do restaurante é obrigatório!' }
      
        if(!productsList || productsList.length === 0)
          return  { error: true, message: 'Um produto deve ser inserido para a compra!' }
      
        if(!payment)
          return { error: true, message: 'A forma de pagamento deve ser informada!' }
      
        if(!priceTotal || priceTotal === 0) 
          return { error: true, message: 'O total da compra não foi informado!' }
      
        if(device === devicesConfig.APP) {
          if(!userId || userId === "")
            return { error: true, message: 'O ID do usuário deve ser informado!' }
      
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
            return { error: true, message: 'Algum dos produtos informados não possui cadastro!' }
        })

        return { error: false }
    },


}