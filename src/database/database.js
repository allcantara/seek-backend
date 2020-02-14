const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://allcantara:allcantara@seek-cluster-w4pyr.gcp.mongodb.net/seek', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose

