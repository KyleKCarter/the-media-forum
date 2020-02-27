const logout = (req, res) => {
    req.session.destroy()
    res.status(200).json(req.session)
}

module.exports = {
    logout
}