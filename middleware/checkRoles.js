module.exports = (...roles) => {
    return (req, res, next)=>{
        const currentUserRole = req.currentUser.role
        if(!roles.includes(currentUserRole)){
            res.status(404).json({
                message:`this action not allowed to ${currentUserRole} role`
            })
            return next()
        }
        next()
    }
}