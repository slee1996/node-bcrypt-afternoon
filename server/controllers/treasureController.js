module.exports = {
    dragonTreasure: async(req, res) => {
        const db = req.app.get('db')
        let dragon = await db.get_dragon_treasure(1)

        return res.status(200).send(dragon)
    },

    getUserTreasure: async(req, res) => {
        const db = req.app.get('db')
        const {session} = req

        let userTreasure = await db.get_user_treasure([session.user.id])
        return res.status(200).send(userTreasure)
    },

    addUserTreasure: async(req, res) => {
        const db = req.app.get('db')
        const {treasureURL} = req.body
        const {session} = req
        const {id} = session.user

        let userTreasure = await db.add_user_treasure([treasureURL, id])
        return res.status(200).send(userTreasure)
    },

    getAllTreasure: async(req, res) => {
        const db = req.app.get('db')
        let treasure = await db.get_all_treasure()

        return res.status(200).send(treasure)
    }
}