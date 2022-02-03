const express = require("express");
const Articles = require("../schemas/articles");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();


//게시글 전체 조회
router.get ("/articles", async (req, res) => {
    const { postId } = req.query;
    const articles = await Articles.find({ postId });
    res.json({
        articles,
    });
});

//게시글 조회
router.get ("/articles/:postId", async (req, res) => {
    const { postId } = req.params;
    const [articles] = await Articles.find({ postId: Number(postId) });

    res.json({
        articles,
    });
});

//게시글 생성
router.post ("/articles", authMiddleware,  async (req,res) => {
    const { subject, content } = req.body;
   const nickname = res.locals.users.nickname
    await Articles.create({ subject, content, nickname });
    res.json({ result : "success"});
})

//게시글 수정
router.put("/articles/:postId/modify",authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { subject, content } = req.body;
    const nickname = res.locals.users.nickname
    const existArticles = await Articles.findOne({ postId: Number(postId) });
    if (existArticles.nickname != nickname) {
        return res.send({ success:false, 'msg': "다른 유저의 게시글을 수정할 수 없습니다"});
    }

    if (existArticles.nickname == nickname) {
        await Articles.updateOne({ postId: Number(postId) }, { $set: { subject, content, nickname }})
    }
    res.send({ result: "success", 'msg': '수정이 완료되었습니다!' });
});

//게시글 삭제
router.delete("/articles/:postId", authMiddleware, async  (req, res) => {
    const { postId } = req.params;
    const nickname = res.locals.users.nickname
    const existArticles = await Articles.findOne({ postId: Number(postId) });
    if (existArticles.nickname != nickname) {
        return res.send({ success:false, 'msg': "다른 유저의 게시글을 삭제할 수 없습니다."});
    }
    if (existArticles.nickname == nickname) {
        await Articles.deleteOne({ postId: Number(postId)});
    }

    res.send({ result: "success", 'msg': '삭제 완료!😛' })
});
module.exports = router;

