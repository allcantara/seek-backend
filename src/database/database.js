const mongoose = require("mongoose");

// mongodb+srv://allcantara:allcantara@seek-cluster-w4pyr.gcp.mongodb.net/seek
// mongodb://localhost:27017/seek

mongoose.connect("mongodb://localhost:27017/seek", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

module.exports = mongoose;
