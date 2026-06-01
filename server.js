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

const rutaVotos = path.join(__dirname, "data", "votos.json");

function leerVotos() {
  const data = fs.readFileSync(rutaVotos, "utf8");
  return JSON.parse(data);
}

function guardarVotos(votos) {
  fs.writeFileSync(rutaVotos, JSON.stringify(votos, null, 2));
}

app.get("/api/votos", function (req, res) {
  const votos = leerVotos();
  res.json(votos);
});

app.post("/api/votos", function (req, res) {
  const identificacion = req.body.identificacion;
  const candidato = req.body.candidato;

  if (!identificacion || !candidato) {
    return res.status(400).json({
      mensaje: "Faltan datos: identificación o candidato"
    });
  }

  const votos = leerVotos();

  const yaVoto = votos.find(function (voto) {
    return voto.identificacion === identificacion;
  });

  if (yaVoto) {
    return res.status(400).json({
      mensaje: "Esta identificación ya registró un voto pedagógico"
    });
  }

  const nuevoVoto = {
    id: Date.now(),
    identificacion: identificacion,
    candidato: candidato,
    fecha: new Date().toISOString()
  };

  votos.push(nuevoVoto);
  guardarVotos(votos);

  res.status(201).json({
    mensaje: "Voto pedagógico guardado correctamente",
    voto: nuevoVoto
  });
});
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});