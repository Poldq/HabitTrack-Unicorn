const checkAuthorization = (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({ error:'Unauthorized'});
    }
    next();
};

module.exports = checkAuthorization;