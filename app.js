const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

// SDK de Mercado Pago
const mercadopago = require("mercadopago");

// Agrega credenciales
mercadopago.configure({
  access_token: "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
  integrator_id: "dev_24c65fb163bf11ea96500242ac130004"
});

const app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('assets'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/detail', (req, res) => {
    res.render('detail', req.query);
});

app.post("/create_preference", (req, res) => {

	let preference = {
		items: [
			{
                id: req.body.order.id,
				title: req.body.order.title,
                description: req.body.order.description,
                picture_url: req.body.order.picture,
				unit_price: Number(req.body.order.unit_price),
				quantity: Number(req.body.order.quantity),
			}
		],
        payer: req.body.payer,
		back_urls: {
			"success": "https://mercado-pago-dev-program.herokuapp.com/feedback",
			"failure": "https://mercado-pago-dev-program.herokuapp.com/feedback",
			"pending": "https://mercado-pago-dev-program.herokuapp.com/feedback"
		},
		auto_return: "approved",
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "visa"
                }
            ],
            installments: 6
        },
        notification_url: "https://mercado-pago-dev-program.herokuapp.com/ipn",
	};

    console.log("E", preference)

	mercadopago.preferences.create(preference).then((response) => {
        console.log("response", response)
        res.status(200).json({
            id: response.body.id
        });
	}).catch((error) => {
		console.log(error);
	});
});

app.get('/feedback', (req, res) => {
	res.status(200).json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

app.post('/ipn', (req, res) => {
    
    console.log("Notificacion:", req);

	res.status(200).json({
		data: req
	});
});

app.listen(port, () => {
    console.log(`API REST corriendo en http://localhost:${port}`);
});