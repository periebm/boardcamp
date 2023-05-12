import { db } from "../database/database.config.js";



export async function getCustomers(req, res){

    try {
        const customers = await db.query('SELECT * from customers');

        customers.rows.forEach((d) => {
            d.birthday = new Date(d.birthday).toISOString().split('T')[0];
        })

        res.send(customers.rows)
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function getCustomersId(req, res){
    const {id} = req.params;

    try {
        const customer = await db.query(
            'SELECT * FROM customers WHERE id = $1;', [id]
        )

        if(!customer.rows.length) return res.sendStatus(404);

        customer.rows[0].birthday = new Date(customer.rows[0].birthday).toISOString().split('T')[0];
        res.send(customer.rows[0])
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function insertCustomer(req, res){
    const {name, phone, cpf, birthday} = req.body;

    try {
        const user = await db.query(
            'SELECT * FROM customers WHERE cpf = $1;',
            [cpf]
        )

         if(user.rowCount) return res.sendStatus(409);

        await db.query(
            'INSERT INTO customers (name,phone, cpf, birthday) VALUES ($1, $2, $3, $4);',
            [name,phone, cpf, birthday]
        )
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function updateCustomer(req, res){
    const {id} = req.params
    const {name, phone, cpf, birthday} = req.body;

    try {


        const user = await db.query(
            'UPDATE customers SET (name,phone, cpf, birthday) VALUES ($1, $2, $3, $4) WHERE id = $5',
            [name, phone, cpf, birthday]
        )
    } catch (err) {
        res.status(500).send(err.message);
    }
}