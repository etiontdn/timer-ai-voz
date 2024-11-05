const express = require('express')
const genAi = require('./genAi.js')
const app = express()
const cors = require('cors')


app.use(cors())  // only this should works for every case also you can try 

app.use(express.json())

app.post('/interpret', async (req, res) => {
    const prompt = `Traduza e interprete a frase fornecida no contexto de um sistema de gerenciamento de tarefas a voz, então tenha leniência com palavras que foram compreendidas errado pelo interpretador de voz. 
    Se a frase puder ser entendida como um comando para iniciar um timer,
    responda somento o formato "Timer XX:YY - [Nome]" (XX:  minutos e YY: segundos),
    sem nenhuma analise adicional.
    Caso contrário, responda apenas "no". Por exemplo,
    para a frase 'estudar por 30 minutos',
    o sistema poderia retornar 'Timer 30:00 - Estudar'.
    Não analise a solicitação, responda somente no formato especificado na primeira linha\n`
    + req.body.phrase;
    const response = await genAi.sendPrompt(prompt)
    res.json({response}).status(200).send()
})

app.listen(3000, () => {
console.log('Listening on port 3000')
})