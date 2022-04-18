const mercadopago = new MercadoPago('APP_USR-ee70a80f-0848-4b7f-991d-497696acbdcd', {
    locale: 'es-UY'
});

window.onload = () => {

    const ruta = window.location.pathname;

    if (ruta === '/detail') {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        const orderData = {
            order: {
                id: urlParams.get('id'),
                title: urlParams.get('title'),
                description: urlParams.get('description'),
                picture: urlParams.get('img'),
                unit_price: urlParams.get('price'),
                quantity: urlParams.get('unit')
            },
            payer: {
                name: "Lalo",
                surname: "Landa",
                email: "test_user_63274575@testuser.com",
                phone: {
                    area_code: "11",
                    number: 44444444
                },
                identification: {
                    type: "DNI",
                    number: "12345678"
                },
                address: {
                    street_name: "Falsa",
                    street_number: 123,
                    zip_code: "11300"
                }
            }
        };
        
        fetch("/create_preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        }).then((response) => {
            return response.json();
        }).then((preference) => {
            
            mercadopago.checkout({
                preference: {
                    id: preference.id
                },
                render: {
                    container: '#mercadopago-button',
                    label: 'Pagar la compra',
                }
            });

        }).catch((error) => {
            console.log("Error", error);
        });
    }
};


