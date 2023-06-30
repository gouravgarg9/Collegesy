const express = require("express");
const userControllers = require("./../controllers/userControllers");
const authControllers = require("../controllers/authControllers");
const chatControllers = require("./../controllers/chatControllers");
const productControllers = require("./../controllers/productControllers");
const router = express.Router();
router.get("/getChats", authControllers.protect, chatControllers.getChats);
router.get("/getChat/:productId",authControllers.protect,
  productControllers.putProductOnReq,
  chatControllers.getChatbyProduct
);
router.post("/blockChat",authControllers.protect,chatControllers.blockChat)
module.exports = router;
