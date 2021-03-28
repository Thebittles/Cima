


exports.Something = (User, req, res) => {
    User.findOne({_id: req.user._id})
}