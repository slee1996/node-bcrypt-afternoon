const bcrypt = require('bcryptjs')

module.exports = {
    register: async(req, res) => {
        const {username, password, isAdmin} = req.body
        const db = req.app.get('db')
        const {session} = req

        let result = await db.get_user(username)
        const existingUser = result[0]
        if(existingUser){
            return res.status(409).send('User already exists')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        let registeredUser = await db.register_user(isAdmin, username, hash)
        let user = registeredUser[0]
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        res.status(201).send(session.user)
    },

    login: async(req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')
        const {session} = req
        let foundUser = await db.get_user(username)

        const user = foundUser[0]
        if(!user){
            return res.status(401).send('User not found. Please register as a new user.')
        }

        const authenticated = bcrypt.compareSync(password, user.hash)
        if(authenticated){
            delete user.user_password
            session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username
            }
            res.status(202).send(session.user)
        } else {
            res.status(403).send('Incorrect Password')
        }
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}