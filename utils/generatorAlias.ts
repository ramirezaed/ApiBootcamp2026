const words = [
  "luna",
  "sol",
  "rio",
  "mar",
  "cielo",
  "nube",
  "fuego",
  "bosque",
  "estrella",
  "viento",
  "piedra",
  "flor",
  "campo",
  "norte",
  "sur",
  "montaña",
  "oceano",
  "arena",
  "trueno",
  "brisa",
  "roble",
  "cristal",
  "oro",
  "plata",
  "cometa",
  "aurora",
  "coral",
  "valle",
  "isla",
  "rayo",
  "niebla",
  "faro",
  "jazmin",
  "olivo",
  "cedro",
  "pradera",
];

const generateAlias = () => {
  const first = words[Math.floor(Math.random() * words.length)];
  const second = words[Math.floor(Math.random() * words.length)];

  return `${first}.${second}`;
};

export default generateAlias;
