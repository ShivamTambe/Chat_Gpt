const ejs = require("ejs");
const path = require("path");
const bodyparser = require('body-parser');
const express = require('express');
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const app = express();
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.render("home");
})
let array=[];
app.post('/chat', async(req, res) => {
    let chat = req.body.chat;
    array.push(chat);
    try{
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${chat}`,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
          });
          array.push(response.data.choices[0].text);
          res.render("ans",{data:array})
    }catch(error){
        res.render("ans",{error:error})
    }
});


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
  
