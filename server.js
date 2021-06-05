let express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();
const superagent = require('superagent');
const {
    response
} = require('sneaks-api');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/', function (req, res) {
    res.render("index");
})

app.post('/search', function (req, res) {
    const {
        sneakname
    } = req.body;
    let infoarray = [];
    superagent.get('http://localhost:3000/search/:' + sneakname).end((err, response) => {
        try {
            response.body.forEach(element => {
                infoarray.push({
                    name: element.shoeName,
                    price: element.retailPrice,
                    image: element.thumbnail,
                    lowest: element.lowestResellPrice,
                    links: element.resellLinks
                });
            })
        }catch(err) {
            res.render('error')
        }
        res.render('search', {
            shoeslist: infoarray
        });
    });
})

app.get('/hot', function (req, res) {
    let infohot = [];
    superagent.get('localhost:3000/home').end((err, response) => {
        response.body.forEach(element => {
            try {
            let linkshoes = [];
            let alllinks = element.resellLinks;
            for (const link of Object.keys(alllinks)) {
                linkshoes.push(alllinks[link])
            }
            infohot.push({
                name: element.shoeName,
                price: element.retailPrice,
                image: element.thumbnail,
                lowest: element.lowestResellPrice,
                links: linkshoes
            });
        } catch(err){
            res.render('error')
        }
        })
        res.render('search', {
            shoeslist: infohot
        });
    })
})

app.get('/info', function (req, res) {
    res.render('informations')
});

app.get('/contact', function (req, res) {
    res.render('contact')
})

const listener = app.listen(process.env.PORT, () => {
    console.log("Your sneakers are available at : http://localhost:" + listener.address().port);
});