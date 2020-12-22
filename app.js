require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const app = express();

const routes = require("./routes");
const userRoute = require("./routes/user");

// Static folder for express
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// viewing engine as ejs
app.set("view engine", "ejs");
app.use(expressLayouts);

// middlewares
require("./middlewares/mongoose");
require("./config/passport");

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
// Route handler
app.use("/", routes);
app.use("/user", userRoute);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port, function (reqest, response) {
  console.log(`Server Started Sucessfully on ${port} !`);
});

// const addProject = async (req, res) => {
//   let {
//     user,
//     userOwn,
//     title,
//     tagLine,
//     thumbnailImage,
//     story,
//     video,
//     codeBaseLink,
//     teamMember,
//     tags,
//   } = req.body;
//   let response = Response(STATUS_CODE.SUCCESS, PROJECT.SUCCESS, "");
//   try {
//     if (user !== userOwn) {
//       response.statusCode = STATUS_CODE.UNAUTHORIZATION;
//       response.message = AUTHENTICATION.UNAUTHORIZED;
//     } else {
//       const project = {
//         title: title,
//         thumbnail_image: thumbnailImage,
//         tag_line: tagLine,
//         story: story,
//         video: video,
//         code_base_link: codeBaseLink,
//         team_member: teamMember,
//         tags: tags,
//         owner: user,
//       };
//       await Project.create(project);
//       await User.findOneAndUpdate(
//         { username: user },
//         {
//           $inc: {
//             total_project_count: 1,
//             pending_project_count: 1,
//           },
//         }
//       );
//       let allTags = await Tag.find();
//       allTags = allTags[0];
//       for (let i = 0; i < tags.length; i++) {
//         if (allTags.all_tags[tags[i]]) {
//           allTags[tags[i]]++;
//         } else {
//           allTags[tags[i]] = 1;
//         }
//       }
//       await Tag.findByIdAndUpdate(allTags.all_tags._id, {
//         $set: {
//           all_tags: allTags.all_tags,
//         },
//       });
//     }
//   } catch (err) {
//     logger.error(
//       TYPE_LOG.USER,
//       "Exeption, user cannot add project: ",
//       err.stack
//     );
//     response = systemError(PROJECT.EXCEPTION);
//   }
//   res.send(response);
// };
