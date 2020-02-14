const mongoose = require('mongoose')

// mongodb+srv://allcantara:allcantara@seek-cluster-w4pyr.gcp.mongodb.net/seek

mongoose.connect('mongodb://localhost:27017/seek', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose

