module.exports = {
  generateCode(size) {
    var randomized = Math.ceil(Math.random() * Math.pow(10, size));
    var digito = Math.ceil(Math.log(randomized));
    while (digito > 10) {
      digito = Math.ceil(Math.log(digito));
    }

    return randomized + "-" + digito;
  }
};
