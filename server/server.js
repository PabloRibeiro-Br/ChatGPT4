import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Olá, bem-vindo! Este é um assistente sobre cachorros.'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt.toLowerCase();

    // Verifique se o prompt está relacionado a cachorros
    if (prompt.includes('cachorro') || prompt.includes('cão') || prompt.includes('animal de estimação')) {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0.5,
        max_tokens: 200, 
        top_p: 0.4, 
        frequency_penalty: 0.5, 
        presence_penalty: 0, 
      });

      res.status(200).send({
        bot: response.data.choices[0].text
      });
    } else {
      res.status(200).send({
        bot: 'Desculpe, este assistente responde apenas sobre cachorros.'
      });
    }

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
