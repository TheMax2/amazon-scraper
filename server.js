const puppeteer = require('puppeteer');
const fs = require('fs');

const Item = require("./model/Item.js");
/** User defined input */
const jsonData = require("./data.json");
/** Server generated output */
const jsonItems = require("./items.json");

/** xPaths of html elements. used by puppeteer */
const xPaths = {
    title : '//*[@id="productTitle"]',
    image : '//*[@id="landingImage"]',
    price1: '//*[@id="priceblock_ourprice"]',
    price2: '//*[@id="size_name_0_price"]/span',
    rate  : '//*[@id="reviewsMedley"]/div/div[1]/div[2]/div[1]/div/div[2]/div/span/span',
    desc  : '//*[@id="productDescription"]/p'
}

/** function for refreshing items list. Checks if user inputed any new data and adds to list */
async function refresh(){
    let items = [];
    await asyncForEach(jsonData, async (elem) => {
        let item = listContainsItem(jsonItems, elem);
        if (item === undefined) item = await scrapeProduct(elem);
        items.push(item);
    })
    fs.writeFile('./items.json', JSON.stringify(items, null, 4), err => {}); 
}

/** function for restarting the items list. Completely deletes and recreates the list. */
async function restart(){
    let items = [];
    await asyncForEach(jsonData, async (elem) => {
        let item = await scrapeProduct(elem);
        items.push(item);
    })
    fs.writeFile('./items.json', JSON.stringify(items, null, 4), err => {});
}

/** A regular foreach loop but async */
async function asyncForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
      await callback(array[i], i, array);
    }
  }
/** A bollean function checking if item is in list. returns the item if it exists and undefined if not */
function listContainsItem(list, item){
    let res = undefined;
    list.forEach(elem => {
        if (elem.url == item.url){
            res = elem;
            // return statements dont work in foreach loops!
        }
    })
    return res;
}

/**
 * Uses puppeteer to start a browser and grab item data from the web. Returns an item object
 * @param {the user inputed item} item 
 */
async function scrapeProduct(item){
    try {
        const url = item.url + "";
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const image = await getImg(page.$x(xPaths.image));
        const title = (await getTxt(page.$x(xPaths.title)))
            .replace(/(\r\n|\n|\r)/gm, ""); //deletes new line chars;
        var testPrice = await getTxt(page.$x(xPaths.price1)); 
        if (testPrice === undefined){
            testPrice = await getTxt(page.$x(xPaths.price2));
            testPrice = "$"+testPrice.split('$')[1].split(' ')[0];
        }
        const price = testPrice;
        const rate = await getTxt(page.$x(xPaths.rate)); 
        const desc = await getTxt(page.$x(xPaths.desc));
        let product = new Item(url, title, item.type, price, image, rate, desc, item.sumry, item.refs, item.link);
        browser.close();
        return product;

    } catch (e){
        console.log(e);
        return undefined;
    }
    
}

/** a function for scraping an image*/
async function getImg(pagePath){
    try{    
        const [el] = await pagePath;
        const src = await el.getProperty('src');
        const txt = await src.jsonValue();
        return txt;
    } catch {
        return undefined;
    }
}

/** a function for scraping text */
async function getTxt(pagePath){
    try{
        const [el] = await pagePath;
        const src = await el.getProperty('textContent');
        const txt = await src.jsonValue();
        return txt;
    } catch (e) {
        return undefined;
    }
}

/** main method */
function main(){
    refresh();
}
main();