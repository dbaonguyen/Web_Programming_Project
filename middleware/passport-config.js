const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUsers = async (username, password, done) => {
        const user = getUserByUsername(username);
        if (user == null) {
            return done(null, false, { message: "No user found with that username" });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password Incorrect" });
            }
        } catch (error) {
            console.log(error);
            return done(error); // Fix: Change 'e' to 'error'
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUsers)); // Provide the verify callback
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
}

module.exports = initialize;
