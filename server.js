const express =require("express");
const fs =require("fs");
const path =require("path");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const rutacandidatos = path.join(__dirname, "data", "candidatos.json")

function leercandidato(){
    const data = fs.readFileSync(rutacandidatos, "utf8");
    return JSON.parse(data);
} 

function guardarcandidato(candidatos){
    fs.writeFileSync(rutacandidatos, JSON.stringify(candidatos, null , 2));
}

app.get("/api/candidatos", function (req, res) {
    const candidatos = leercandidato();
    res.json(candidatos);
});

app.post("/api/candidatos", function (req, res) {
    const nuevoCandidato = {
        id: Date.now(),
        nombre: req.body.nombre,
        rol: req.body.rol,
        propuesta: req.body.propuesta,
        estado: "perfil de práctica académica",
    };

    if (!nuevoCandidato.nombre || !nuevoCandidato.rol || !nuevoCandidato.propuesta) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const candidatos = leercandidato();
    candidatos.push(nuevoCandidato);
    guardarcandidato(candidatos);

    return res.status(201).json(nuevoCandidato);
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});