const crypto = require("crypto");
const algorithm = "aes-256-ctr";
const { v4: uuidv4 } = require("uuid");

const encrypt = (req, res, next) => {
  const text = req.body.url;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, process.env.SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const url = { iv: iv.toString("hex"), content: encrypted.toString("hex") };
  const title = req.body.title;
  const image = req.body.feedImage;
  const titleIv = crypto.randomBytes(16);
  const titleCipher = crypto.createCipheriv(
    algorithm,
    process.env.SECRET_KEY,
    titleIv
  );
  const titleEncrypted = Buffer.concat([
    titleCipher.update(title),
    titleCipher.final(),
  ]);
  let encryptedImage;
  if (image) {
    const imageCipher = crypto.createCipheriv(
      algorithm,
      process.env.SECRET_KEY,
      titleIv
    );
    const imageEncrypted = Buffer.concat([
      imageCipher.update(image),
      imageCipher.final(),
    ]);
    encryptedImage = {
      iv: titleIv.toString("hex"),
      content: imageEncrypted.toString("hex"),
    };
  } else {
    encryptedImage = null;
  }

  const encryptedTitle = {
    iv: titleIv.toString("hex"),
    content: titleEncrypted.toString("hex"),
  };

  res.locals.encrypted = { url, encryptedTitle, encryptedImage };
  next();
};

const decrypt = (req, res, next) => {
  const resObject = {};
  if (!res.locals.bypass) {
    Object.entries(res.locals.user.feeds).map((category) => {
      Object.defineProperty(resObject, category[0], {
        value: [],
        writable: true,
        enumerable: true,
      });
      category[1].forEach((feed) => {
        const hash = feed.url;
        const title = feed.title;
        const image = feed.image;
        const decipher = crypto.createDecipheriv(
          algorithm,
          process.env.SECRET_KEY,
          Buffer.from(hash.iv, "hex")
        );
        const decrpyted = Buffer.concat([
          decipher.update(Buffer.from(hash.content, "hex")),
          decipher.final(),
        ]);
        const decryptedUrl = decrpyted.toString();
        const titleDicipher = crypto.createDecipheriv(
          algorithm,
          process.env.SECRET_KEY,
          Buffer.from(title.iv, "hex")
        );
        const titleDecrypted = Buffer.concat([
          titleDicipher.update(Buffer.from(title.content, "hex")),
          titleDicipher.final(),
        ]);
        const decryptedTitle = titleDecrypted.toString();
        let decryptedImage;
        if (image) {
          const imageDicipher = crypto.createDecipheriv(
            algorithm,
            process.env.SECRET_KEY,
            Buffer.from(image.iv, "hex")
          );
          const imageDecrypted = Buffer.concat([
            imageDicipher.update(Buffer.from(image.content, "hex")),
            imageDicipher.final(),
          ]);
          decryptedImage = imageDecrypted.toString();
        } else {
          decryptedImage = null;
        }

        resObject[category[0]].push({
          url: decryptedUrl,
          title: feed.title,
          enUrl: hash,
          plainTitle: decryptedTitle,
          uuid: uuidv4(),
          image: decryptedImage,
          enImg: image,
        });
      });
    });
    res.locals.user.decrypted = resObject;
  }

  next();
};

module.exports = { encrypt, decrypt };
