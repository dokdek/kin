const admin = require('./admin');

const createUser = async(req, res) => {
    const {
        email,
        password,
        categories,
    } = req.body;

    const user = await admin.auth().createUser({
        email,
        password,
        categories,
    });

    return res.send(user);
}

export default createUser
