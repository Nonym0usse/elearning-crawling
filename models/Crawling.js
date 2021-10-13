
function Crawling(title, img, price, description, person_number, category) {
    this.title = title || 'Undefined';
    this.img = img || 'Undefined';
    this.price = price || 'Undefined';
    this.description = description || 'Undefined';
    this.person_number = person_number || 'Undefined';
    this.category = category || 'Undefined';
  }

Crawling.prototype.setTitle = function(title) {
      this.title = title;
};

Crawling.prototype.setImg = function(img) {
    this.img = img;
};

Crawling.prototype.setPrice = function(price) {
    this.price = price;
};

Crawling.prototype.setDescription = function(description) {
  this.description = description;
};

Crawling.prototype.setPersonNumber = function(person_number) {
  this.person_number = person_number;
};

Crawling.prototype.setCategory = function(category) {
  this.category = category;
};

module.exports = Crawling;