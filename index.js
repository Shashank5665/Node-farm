//------------------------------------------------------------------------------------------------

const fs = require("fs")
const http = require("http")
const slugify = require("slugify")
const replaceTemplate = require("./module_replace/replace.js")

//-------------------------------------------------------------------------------------------------

const tempOverview = fs.readFileSync(`${__dirname}/templates/template_overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template_cards.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template_product.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

//-------------------------------------------------------------------------------------------------

const server = http.createServer((req, res) => {
    const baseURL = `http://localhost:8000`;
    const requestURL = new URL(req.url, baseURL);
    const pathname = requestURL.pathname;
    const query = requestURL.searchParams.get("id");
    console.log(req.url);
    console.log(requestURL);

//-----------------------------------------------------------------------------------------------------------------------------------------------

    //Overview page
    if(pathname === "/overview" || pathname === "/"){
    res.writeHead(200, {
        "Content-type": "text/html"
    })
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("")
    const output = tempOverview.replace("{PRODUCT_CARDS}", cardsHtml)
    res.end(output)
    }

    //Products page
    else if(pathname === "/product"){
        res.writeHead(200, {
            "Content-type": "text/html"
        })
        const product = dataObj[query]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    }

    //API page
    else if(pathname === "/api"){
        res.writeHead(200, {
            "Content-type": "application/json"
        })
            res.end(data)
        }

    //Not found page
    else{
        res.writeHead(404)
        res.end("Oops! Page you were looking for is not found")
    }

//------------------------------------------------------------------------------------------------------------------------------------------------
})
server.listen(8000, () => {
    console.log("Listening to port 8000");
})