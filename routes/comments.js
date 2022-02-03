const express = require("express");
const Comments = require("../schemas/comments");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

//댓글 조회
router.get ("/comments/:postId", async (req, res) => {
    const {postId} = req.query;
    const comments = await Comments.find({postId:postId});
    res.json({
        comments,
    });
});
//댓글 생성
router.post("/comments",authMiddleware, async (req, res) => {
    const { content, postId } = req.body;
    const nickname = res.locals.users.nickname

    await Comments.create({content, nickname, postId});
    res.json({result: "success"})
})
//댓글  수정
router.put("comments/:commentId/modify", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const nickname = res.locals.users.nickname;
    const existComments = await Comments.findOne({ commentId: Number(commentId) });
    if (existComments.nickname != nickname) {
        return res.send({ success:false, 'msg': "다른 유저의 댓글을 수정할 수 없습니다."});
    }

    if (existComments.nickname == nickname) {
        await Comments.updateOne({ commentId: Number(commentId) }, { $set: { content, nickname }})
    }
    res.send({ result: "success", 'msg': '수정이 완료되었습니다!' });
});
// 댓글 삭제
router.delete("/comments/:commentId", authMiddleware, async  (req, res) => {
    const { commentId } = req.params;
    const nickname = res.locals.users.nickname
    const existComments = await Comments.findOne({ commentId: Number(commentId) });
    if (existComments.nickname != nickname) {
        return res.send({ success:false, 'msg': "다른 유저의 댓글을 삭제할 수 없습니다."});
    }
    if (existComments.nickname == nickname) {
        await Comments.deleteOne({ commentId: Number(commentId)});
    }

    res.send({ result: "success", 'msg': '삭제 완료!😛' })
});
module.exports = router;