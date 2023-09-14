const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport){
    const authenticateUsers = async (username, password, done) => {
        const user = getUserByUsename(username)
        if (user == null){
            return done(null,false,{message : "No user found with that username"})
        }
        try {
            if (await bcrypt.compare(password,user.password)){
                return done(null,user)
            }
        } catch (error){
            console.log(error);
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'username'}))
    passport.serializeUser((user,done) => {})
    passport.deserializeUser((id,done) => {})
}

module.exports = initialize