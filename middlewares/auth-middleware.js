const jwt = require("jsonwebtoken");
const User = require("../schemas/users");
module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split( ' ' );
    if (tokenValue=='null') {
        res.locals.users=null
        next()
        return;
    }

    if (tokenType !== "Bearer") {
        res.status(401).send ({
            errorMessage: "로그인 후 사용하세요 😶"
        })
        return;
    }

    try {
        const { userId } = jwt.verify(tokenValue, "holy-moly"); 
        //const userId1 = String(userId)
        User.findOne({userId}).exec().then((user) =>  {
        //User.findOne(userId).then((user) => 
            res.locals.users = user;
            next();
        });
        }   catch (error) {
        res.status(400).send ({
            errorMessage:"로그인 후 사용하세요 😶",
        });
        return;
    }
};