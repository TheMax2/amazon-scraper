/**
 * A class to represent an item for sale on the website.
 * @param {the amazon url of the item used for scanning} url 
 * @param {the official name of the product} name 
 * @param {the type of item} type 
 * @param {the price of the item} price 
 * @param {image of the item} image 
 * @param {the review rating out of 5} rate 
 * @param {the official descrption} desc 
 * @param {the unoffical description} sumry 
 * @param {the cited sources} refs 
 * @param {the affiliate link} link 
 */
function Item(url, name, type, price, image, rate, desc, sumry, refs, link){
    this.url = url;
    this.name = name;
    this.type = type;
    this.price = price;
    this.image = image;
    this.rate = rate;
    this.desc = desc;
    this.sumry = sumry;
    this.refs = refs;
    this.link = link;
}
Item.prototype.print = function(){
    console.log("url: " + this.url);
    console.log("name: " + this.name);
    console.log("type: " + this.type);
    console.log("price: " + this.price);
    console.log("image: " + this.image);
    console.log("rate: " + this.rate);
    console.log("description: " + this.desc);
    console.log("summary: " + this.sumry);
    console.log("refferences: " + this.refs);
    console.log("link: " + this.link);
    console.log(" ");
}
module.exports = Item;
