const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const config = require("./config.json");
const apikey = config.apikey;   

const app = express();
app.listen(3001);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const traducaoClima = {
    "few clouds": "Poucas Nuvens",
    "scattered clouds": "Nuvens Dispersas",
    "overcast clouds": "Nublado",
    "broken clouds": "Nuvens Dispersas",
    "shower clouds": "Nuvens Cheias",
    "clear sky": "Céu Limpo",
    "light rain": "Chuva Leve",
    "light intensity drizzle": "Chuvisco Intenso",
    "moderate rain": "Chuva Moderada",
    "shower rain": "Chuva Rápida",
    "mist": "Névoa",
    "thunderstorm": "Tempestade",
    "snow": "Neve"
    
}

app.get("/climatempo/:cidade", async(req, res) => {
    const city = req.params.cidade;

    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);

        if(response.status === 200) {
            const clima = traducaoClima[response.data.weather[0].description] || response.data.weather[0].description;

            const weatherData = {
                temperatura : response.data.main.temp,
                umidade : response.data.main.humidity,
                velocidadeDoVento : response.data.wind.speed,
                clima : clima,
                nome : response.data.name
            };

            res.send(weatherData);
        } else {
            res.status(response.status).send({erro : "Erro ao obter informações", error});
        }
    } catch (error) {
        res.status(500).send({erro : "Erro ao obter dados metereológicos", error})
    }
})