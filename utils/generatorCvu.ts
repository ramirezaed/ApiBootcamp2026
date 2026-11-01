const generateCvu = () => {
  const random = Math.floor(10000 + Math.random() * 90000);

  return `00009${random}`;
};

export default generateCvu;
