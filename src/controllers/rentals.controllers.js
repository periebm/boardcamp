import { db } from "../database/database.config.js";


export async function getRents(req, res){
    try {

    } catch (err) {
        res.status(500).send(err.message);
    }
}

/* {
    id: 1,
    customerId: 1,
    gameId: 1,
    rentDate: '2021-06-20',    // data em que o aluguel foi feito
    daysRented: 3,             // por quantos dias o cliente agendou o aluguel
    returnDate: null,          // data que o cliente devolveu o jogo (null enquanto não devolvido)
    originalPrice: 4500,       // preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)
    delayFee: null             // multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)
  } */


export async function insertRent(req, res){
    const { customerId, gameId, daysRented} = req.body;

    try {
        if(daysRented <= 0) return res.sendStatus(400);

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

        if(rentalsStock.rows.length >= game.rows[0].stockTotal) return res.sendStatus(400);
        
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


export async function completeRent(req, res){

    try {
        
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function deleteRent(req, res){

    try {
        
    } catch (err) {
        res.status(500).send(err.message);
    }
}