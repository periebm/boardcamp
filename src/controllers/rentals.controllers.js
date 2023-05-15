import { db } from "../database/database.config.js";


export async function getRents(req, res) {
    try {
        const rentals = await db.query(
            `
            SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
                FROM rentals 
                JOIN customers 
                    ON rentals."customerId" = customers.id
                JOIN games
                    ON rentals."gameId" = games.id;
            `
        )

        rentals.rows.map((e) => {
            if (e.returnDate !== null) e.returnDate = new Date(e.returnDate).toISOString().split('T')[0]


            e.rentDate = new Date(e.rentDate).toISOString().split('T')[0];
            e.customer = {
                  id: e.customerId, name: e.customerName
              };
            e.game = {
                id: e.gameId, name: e.gameName
             };
            delete e.gameName;
            delete e.customerName;

        })

        res.send(rentals.rows)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function insertRent(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        if (daysRented <= 0) return res.sendStatus(400);

        const game = await db.query(
            'SELECT * FROM games WHERE id = $1;', [gameId]
        )
        if (!game.rows.length) return res.sendStatus(400);

        const customer = await db.query(
            'SELECT * FROM customers WHERE id = $1;', [customerId]
        )
        if (!customer.rows.length) return res.sendStatus(400);

        const rentalsStock = await db.query(
            'SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;', [gameId]
        )

        if (rentalsStock.rows.length >= game.rows[0].stockTotal) return res.sendStatus(400);

        const rentDate = new Date().toISOString().split('T')[0];
        const returnDate = null;
        const originalPrice = game.rows[0].pricePerDay * daysRented;
        const delayFee = null;

        await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
        );

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function completeRent(req, res) {
    const { id } = req.params;

    try {
        const rental = await db.query(
            'SELECT * FROM rentals WHERE id = $1;', [id]
        )

        if (!rental.rows.length) return res.sendStatus(404);
        if (rental.rows[0].returnDate !== null) return res.sendStatus(400);

        const returnedDate = new Date();
        //const daysLate = (Math.abs(returnedDate - rental.rows[0].rentDate)) / (1000 * 3600 * 24);
        //let fee = daysLate * rental.rows[0].originalPrice;
        const fee = 100;
        //if (daysLate < 1) fee = null;

        await db.query(
            'UPDATE rentals SET "returnDate" = $1,"delayFee" = $2 WHERE id = $3;',
            [returnedDate, fee, id]
        )

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function deleteRent(req, res) {
    const { id } = req.params;

    try {
        const rental = await db.query(
            'SELECT * FROM rentals WHERE id = $1;', [id]
        )
        if (!rental.rows.length) return res.sendStatus(404);
        if (rental.rows[0].returnDate === null) return res.sendStatus(400);
        
        await db.query(
            'DELETE FROM rentals WHERE id = $1;',
            [id]
        )
        
        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}