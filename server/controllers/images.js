const uploadImage = (req, res) => {
  const { image } = req.files;

  if (!image) {
    res.status(400);
    return;
  }

  const imageExtension = path.extname(image.name);

  const imageName = Date.now() + imageExtension;

  const imagePath = "/upload/" + imageName;

  image.mv(__dirname + imagePath);

  res.json(imagePath).status(200);
};

module.exports = {
  uploadImage,
};
