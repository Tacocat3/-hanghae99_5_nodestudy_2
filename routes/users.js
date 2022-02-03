const express = require("express");
//const req = require("express/lib/request");
const User = require("../schemas/users");
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken");
//const mongoose = require("mongoose");

const router = express.Router();

const postUsersSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

//회원가입
//한글을 추가하려면 [가-힣]
const nicknameRegExp = /^[A-z0-9]{4,}/; //닉네임 유효성 검사.

router.post("/users", async (req, res) => {
  try {
    const { nickname, password, confirmPassword } =
      await postUsersSchema.validateAsync(req.body);

    if (password !== confirmPassword) {
      res.status(200).send({
        errorMessage: "패스워드가  패스워드 확인란과 일치하지 않습니다. 😯",
      });
      return;
    }
    if (password.length < 4) {
      res.status(200).send({
        errorMessage: "패스워드는 최소 4자 이상이어야 합니다. 🤔",
      });
      return;
    }
    if (password.indexOf({ nickname }) !== -1) {
      res.status(200).send({
        errorMessage: "패스워드는 닉네임과 다른 값을 사용해야 합니다. 🤨",
      });
      return;
    }

    if (!nicknameRegExp.test(nickname)) {
      res.status(200).send({
        errorMessage:
          "닉네임은 최소 4자 이상이어야 하며 영문 대소문자 및 숫자로 이루어져야 합니다. 🤔",
      });
      return;
    }
    //console.log(User)
    const existNickname = await User.find({ nickname });

    if (existNickname.length) {
      res.status(200).send({
        errorMessage: "중복된 닉네임입니다.🙄 ",
      });
      return;
    }

    await User.create({ nickname, password });
    res.status(200).send({
      result: "success",
      msg: "회원가입이 완료되었습니다!",
    });
  } catch (err) {
    console.log(err);
    res.status(200).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});
///////////////////////////
const postAuthSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});

//로그인
router.post("/auth", async (req, res) => {
  try {
    const { nickname, password } = await postAuthSchema.validateAsync(req.body);
    const user = await User.findOne({ nickname, password }).exec();
    if (!user) {
      res.status(200).send({
        errorMessage: "닉네임 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, "holy-moly");
    res.send({
      token,
      result: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(200).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
});

module.exports = router;
