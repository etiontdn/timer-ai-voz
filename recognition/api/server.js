const express = require('express')
const genAi = require('genAi.js')
const app = express()

app.get('/interpret', async (req, res) => {
    const data = req.body
    const prompt = ```Traduza e interprete a frase fornecida no contexto de um sistema de gerenciamento de tarefas. 
    Se a frase puder ser entendida como um comando para iniciar um timer,
    responda somento o formato "Timer XX:YY - [Nome]",
    sem nenhuma analise adicional.
    Caso contrário, responda apenas "no". Por exemplo,
    para a frase 'estudar por 30 minutos',
    o sistema poderia retornar 'Timer 30:00 - Estudar'.
    Não analise a solicitação, responda somente no formato especificado na primeira linha lavar roupa 10 minutos\n```
    + req.body.phrase;
    const response = await genAi.sendPrompt(prompt)
    res.json({response})
})

app.listen(3000, () => {
console.log('Listening on port 3000')
})