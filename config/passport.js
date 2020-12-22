const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne(
        {
          email: email,
        },
        (err, user) => {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, {
              message: "Email already Exist ! Please Login",
            });
          }

          var newUser = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            email: email,
            phone_number: req.body.phone_number,
          });

          newUser.password = newUser.encryptPassword(password);

          // saving new user in DB
          newUser.save(function (err, result) {
            if (err) {
              console.log(err);
              return done(err);
            } else {
              return done(null, newUser);
            }
          });
        }
      );
    }
  )
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/user/auth/google/callback"
  },

  (accessToken, refreshToken, profile, cb) => {
    User.findOne(
      {
        email: profile._json.email,
      },
      (err, user) => {
        if (err) {
          return cb(err);
        }
        if (user) {
          return cb(err,user);
        }

        const newUser = new User({
                fname: profile.name.givenName,
                lname: profile.name.familyName,
                email: profile._json.email,
                google_id: profile.id
              });
        // saving new user in DB
        newUser.save(function (err, result) {
          if (err) {
            console.log(err);
            return cb(err);
          } else {
            return cb(null, newUser);
          }
        });
      }
    );
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:5000/user/auth/facebook/callback",
  profileFields: ['id' , 'email','first_name', 'last_name']
},

(accessToken, refreshToken, profile, cb) => {
  User.findOne(
    {
      facebook: profile.id,
    },
    (err, user) => {
      if (err) {
        return cb(err);
      }
      if (user) {
        return cb(err,user);
      }

      const newUser = new User({
              fname: profile.name.givenName,
              lname: profile.name.familyName,
              facebook_id: profile.id
            });
      // saving new user in DB
      newUser.save(function (err, result) {
        if (err) {
          console.log(err);
          return cb(err);
        } else {
          return cb(null, newUser);
        }
      });
    }
  );
}
));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/user/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOne(
    {
      email: profile._json.email,
    },
    (err, user) => {
      if (err) {
        return cb(err);
      }
      if (user) {
        return cb(err,user);
      }
      const name = profile._json.name.split(" ");
      const newUser = new User({
              fname: name[0],
              lname: name[1],
              email: profile._json.email,
              github_id: profile.id
            });
      // saving new user in DB
      newUser.save(function (err, result) {
        if (err) {
          console.log(err);
          return cb(err);
        } else {
          return cb(null, newUser);
        }
      });
    }
  );
}
));
