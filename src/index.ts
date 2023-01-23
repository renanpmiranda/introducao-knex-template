import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Prática 1

app.get("/bands", async (req: Request, res: Response) => {
    try{
        const result = await db.raw(`
            SELECT * FROM bands
        `)

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }    
})

// Prática 2

app.post("/bands", async (req: Request, res: Response) => {
    try{
        const id = req.body.id
        const name = req.body.name

        if(!id || !name){
            res.status(400)
            throw new Error("Dado inválido!")
        }

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("Id deve estar no formato string!")
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("Name deve estar no formato string!")
        }

        await db.raw(`
            INSERT INTO bands (id, name)
            VALUES
                ("${id}", "${name}");
        `)

        res.status(200).send("Banda cadastrada com sucesso!")

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    } 
})

// Prática 3

app.put("/bands/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id      
         
        const newId = req.body.id
        const newName = req.body.name

        if(newId !== undefined){
            if(typeof id !== "string"){
                res.status(400)
                throw new Error("id deve estar no formato string.")
            }

            if(newId.length < 4){
                res.status(400)
                throw new Error("id deve ter no mínimo 4 caracteres")
            }
        }        

        if(newName !== undefined){
            if(typeof newName !== "string"){
                res.status(400)
                throw new Error("name deve estar no formato string.")
            }

            if(newName.length < 2){
                res.status(400)
                throw new Error("name deve ter no mínimo 2 caracteres")
            }
        }  

        const [band] = await db.raw(`
            SELECT * FROM bands
            WHERE id = "${id}"
        `)

        if(band){
            await db.raw(`
            UPDATE bands
            SET 
                id = "${newId || band.id}",
                name = "${newName || band.name}"
            WHERE id = "${id}";
            `)

            res.status(200).send("Banda atualizada com sucesso!")

        } else {
            res.status(404)
            throw new Error("Banda não encontrada.")
        }    

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    } 
})