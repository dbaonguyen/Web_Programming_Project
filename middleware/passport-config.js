const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUsers = async (username, password, done) => {
        try {
            const user = await getUserByUsername(username);
            if (!user) {
                return done(null, false, { message: "No user found with that username" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password Incorrect" });
            }
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUsers));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id);
            return done(null, user);
        } catch (error) {
            console.error(error);
            return done(error);
        }
    });
}


module.exports = initialize;
