const { connectToDB, getDB } = require("../db");
const Parser = require("rss-parser");
const ObjectId = require("mongodb").ObjectId;
const redis = require("redis");
const chalk = require("chalk");
const crypto = require("crypto");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const algorithm = "aes-256-ctr";

let db;
connectToDB((err) => {
  if (!err) {
    db = getDB();
  } else {
    console.log(err);
  }
});
const parser = new Parser();
const client = redis.createClient();
const openConnection = async () => {
  await client.connect();
};
openConnection();

module.exports.fetchCategoriesAndTitles = async (req, res) => {
  const startTime = performance.now();
  res.json(res.locals.user.decrypted);
  const endTime = performance.now();
  console.log(
    chalk.black.bgWhite(`Served titles in ${endTime - startTime} ms`)
  );
};

module.exports.addFeed = async (req, res) => {
  console.log(
    chalk.white.bgBlack("incoming request"),
    res.locals.encrypted.url
  );
  const startTime = performance.now();
  const username = new ObjectId(res.locals.user._id);
  const url = res.locals.encrypted.url;
  const title = res.locals.encrypted.encryptedTitle;
  const image = res.locals.encrypted.encryptedImage;
  let category = req.body.category;
  category ? null : (category = "news");
  const array = `feeds.${category}`;
  const doesItExists = await db
    .collection(process.env.MONGODB_DB_COLLECTION)
    .find({ [array]: { url, title }, _id: res.locals.user._id })
    .toArray();
  if (!doesItExists.length) {
    const dbres = await db
      .collection(process.env.MONGODB_DB_COLLECTION)
      .updateOne(
        { _id: username },
        {
          $push: {
            [array]: { url, title, image },
          },
        },
        {
          upsert: true,
        }
      );
    res.status(200).json();
    const endTime = performance.now();
    console.log(
      chalk.green(`Added new feed: Done in ${endTime - startTime} ms`)
    );
  } else {
    res.status(204).json();
    const endTime = performance.now();
    console.log(
      chalk.blue(`Completed in ${endTime - startTime} ms, found nothing...`)
    );
  }
};

module.exports.parseUrl = async (req, res) => {
  const startTime = performance.now();
  const test = await fetch(req.body.url);
  const response = await test.text();
  const cleared = response.replace("\ufeff", "");
  try {
    const feed = await parser.parseString(cleared);
    const url = req.body.url;
    const data = { ...feed, url };
    res.json(data);
    const endTime = performance.now();
    console.log(chalk.blue(`Parsed in ${endTime - startTime} ms`));
  } catch (error) {
    throw error;
  }
};

module.exports.deleteFeeds = async (req, res) => {
  const startTime = performance.now();
  const username = new ObjectId(res.locals.user._id);
  let checker = 0;
  for (const category of Object.entries(req.body.toBeRemoved)) {
    checker = checker + category[1].length;
  }
  if (checker) {
    const bulkDelete = db
      .collection(process.env.MONGODB_DB_COLLECTION)
      .initializeOrderedBulkOp();
    for (const element of Object.keys(req.body.toBeRemoved)) {
      if (req.body.toBeRemoved[element]) {
        bulkDelete.find({ _id: username }).updateOne({
          $pull: {
            [`feeds.${element}`]: {
              url: { $in: req.body.toBeRemoved[element] },
            },
          },
        });
      }
    }
    const result = await bulkDelete.execute();
    const titles = req.body.onlyTitles;
    const response = { ...result, checker, titles };
    res.status(200).json(response);
    const endTime = performance.now();
    console.log(
      chalk.green(`Delete Operation completed in ${endTime - startTime} ms`)
    );
  } else {
    console.log("useless request");
    res.status(204).json();
  }
};

module.exports.moveFeed = async (req, res) => {
  const bulkDelete = db
    .collection(process.env.MONGODB_DB_COLLECTION)
    .initializeOrderedBulkOp();
  bulkDelete.find({ _id: res.locals.user._id }).updateOne({
    $push: {
      [`feeds.${req.body.newCategory}`]: {
        url: req.body.list.enUrl,
        title: req.body.list.title,
        image: req.body.list.enImg,
      },
    },
  });
  bulkDelete.find({ _id: res.locals.user._id }).updateOne({
    $pull: {
      [`feeds.${req.body.category}`]: {
        url: req.body.list.enUrl,
        title: req.body.list.title,
        image: req.body.list.enImg,
      },
    },
  });
  const response = await bulkDelete.execute();
  res.json();
};

module.exports.renameTitle = async (req, res) => {
  const id = new ObjectId(res.locals.user._id);
  const category = `feeds.${req.body.category}.$.title`;
  const category2 = `feeds.${req.body.category}.title`;
  if (req.body.initialTitle === req.body.newTitle) {
    console.log(chalk.red("NO CHANGES TO BE MADE ON", req.body.newTitle));
    res.json();
  } else {
    console.log(
      chalk.red(`CHANING ${req.body.initialTitle} TO ${req.body.newTitle}`)
    );
    const newTitle = req.body.newTitle;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, process.env.SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(newTitle), cipher.final()]);
    const title = {
      iv: iv.toString("hex"),
      content: encrypted.toString("hex"),
    };
    const response = await db
      .collection(process.env.MONGODB_DB_COLLECTION)
      .updateOne(
        { _id: id, [category2]: req.body.oldEncryptedTitle },
        {
          $set: { [category]: title },
        }
      );
    const document = await db
      .collection(process.env.MONGODB_DB_COLLECTION)
      .findOne({ _id: id }, { [category]: title });
    res.json(response);
    console.log(response);
  }
};

module.exports.deleteOne = async (req, res) => {
  const initial = req.body;
  const response = await db
    .collection(process.env.MONGODB_DB_COLLECTION)
    .updateOne(
      {
        _id: res.locals.user._id,
      },
      {
        $pull: {
          [`feeds.${req.body.category}`]: { url: req.body.enUrl },
        },
      }
    );
  const data = { ...response, initial };
  res.json(data);
};

// module.exports.getPaginatedData = async (req, res) => {
//   const { category, url, page } = req.query;
//   const PaginatedData = await client.get("username");
//   const PaginatedDataParsed = await JSON.parse(PaginatedData);
//   const indexOfElement = PaginatedDataParsed[category].findIndex(
//     (item) => item.url == url
//   );
//   const paginate = (array, page_size, page_number) => {
//     return array.slice((page_number - 1) * page_size, page_number * page_size);
//   };
//   const test = paginate(
//     PaginatedDataParsed[category][indexOfElement].items,
//     6,
//     page
//   );
//   const data = PaginatedDataParsed[category][indexOfElement].items.splice(
//     page,
//     2
//   );
//   res.json(test);
// };
