require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const nodemailer = require("nodemailer");

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "mySessions",
});

app.use(
  session({
    name: "user_sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 60 * 60 * 1000,
      // sameSite: true,
      // httpOnly: true,
    },
  })
);

mongoose.set("strictQuery", false); // MONGOOSE SET STRICTQUERY TO FALSE

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(
  cors({
    origin: ["https://wt-project-frontend-mu.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use("/files", express.static("files"));

//mongodb connection----------------------------------------------
const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

// app.use((req, res, next) => {
//   if (req.session.userID && req.cookies.user_sid) {
//     res.redirect("/");
//   }
//   next();
// });

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    req.session.error = "You have to Login first";
    res.redirect("/login");
  }
};

var sessionChecker = (req, res, next) => {
  console.log("session checked");
  if (req.session.userID && req.cookies.user_sid) {
    console.log("session redirected");
    res.redirect("/");
  } else {
    next();
  }
};

const redirectLogin = (req, res, next) => {
  if (!req.session.userID) {
    res.redirect("/login");
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.userID) {
    res.redirect("/");
  } else {
    next();
  }
};

// app.get("/", sessionChecker, (req, res) => {
//   res.redirect("/");
// });

// app.use(async (req, res, next) => {
//   const { userId } = req.session;
//   if (userId) {
//     try {
//       const user = await User.findOne({ _id: userId });
//       if (user) {
//         res.locals.user = user;
//         console.log("heheheheehhehe" + res.locals.user);
//       }
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//   }
//   next();
// });

// Middleware to set session data to res.locals
// app.use((req, res, next) => {
//   res.locals.sessionData = req.session;
//   next();
// });

// Now you can access session data in any route handler
// app.get("/example-route", (req, res) => {
//   const sessionData = res.locals.sessionData;
//   // Access specific session properties, e.g., email
//   const userEmail = sessionData.email;
//   res.send(`User email: ${userEmail}`);
// });

// // Another route where you can access session data
// app.get("/another-route", (req, res) => {
//   const sessionData = res.locals.sessionData;
//   // Access other session properties as needed
//   res.send(`Session data: ${JSON.stringify(sessionData)}`);
// });

//loginBACKEND ---------------------------------------------------------------

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // tokens: [
  //   {
  //     token: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
});

// generating tokens
// userSchema.methods.generateAuthToken = async function () {
//   try {
//     const token = jwt.sign(
//       { _id: this._id.toString() },
//       process.env.SECRET_KEY
//     );
//     this.tokens = this.tokens.concat({ token: token });
//     await this.save();
//     return token;
//   } catch (error) {}
// };

//multer------------------------------------------------------------
const multer = require("multer");
const { MongoServerClosedError } = require("mongodb");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");

const User = new mongoose.model("User", userSchema);
const reviewer = new mongoose.model("Reviewer", userSchema);

// import react from "../WT_Course_Project/src/components/Login"

//---------------ROUTES-----------------
// app.get("/logout", (req, res) => {
//   if (req.session.userID && req.cookies.user_sid) {
//     req.session.destroy((err) => {
//       if (err) {
//         res.status(400).send("Unable to log out");
//       } else {
//         res.send("Logout successful");
//       }
//     });

//     res.clearCookie("user_sid");
//     res.redirect("/login");
//   } else {
//     res.redirect("/login");
//   }
// });

// app.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.redirect("/");
//     } else {
//       res.clearCookie("user_sid");
//       res.redirect("/login");
//     }
//   });
// });

app
  .route("/login")
  .get(redirectHome, (req, res) => {
    res.render(
      "/Users/abhishekhanchinal/Desktop/temp/wt/WT_Project_SUNDAY/WT_Course_Project/src/components/Login.jsx"
    );
  })
  .post(redirectHome, async (req, res) => {
    console.log("Received login request:", req.body);
    try {
      // let loginEmail = req.body.email;
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      const pdf = await PdfSchema.findOne({ email: email });

      // const token = await user.generateAuthToken(); // CALLING generateAuthToken() function for /login page
      // console.log(token);

      // res.cookie("jwt", token, {
      //   maxAge: 60000,
      //   httpOnly: true,
      // });

      if (user) {
        if (password === user.password) {
          req.session.isAuth = true;
          req.session.user = user;
          req.session.userID = user.id; // --------------------------------------------------------------------SESSION SET
          req.session.email = user.email;

          console.log("Session after login:", req.session);
          req.session.save();
          console.log("SESSION SAVED");
          console.log("Session after login:", req.session);
          console.log("user:" + user);
          console.log("session user ID: " + req.session.userID);
          console.log("current user's email: " + req.session.email);
          console.log("session ID: " + req.sessionID);

          // Set res.locals.user directly
          // res.locals.user = user;
          // console.log(res.locals.user.email);

          // const LOLuser = res.locals.user;
          // console.log("LOLuser's email: " + LOLuser.email);

          if (user.email === pdf?.email) {
            res.send({
              message: "login successful",
              status: "ok", // PDF already submitted
              user: user,
              // passwordMatch: true,
            });
          } else {
            res.send({
              message: "login successful",
              status: "notOK", // Didn't submit PDF even once
              user: user,
              // passwordMatch: true,
            });
          }
        } else {
          res.send({
            status: "PWerror", // PassWord Error
            message: "Password didn't match",
            passwordMatch: false,
          });
        }
      } else {
        res.send({
          status: "NRerror", // Not Registered Error
          message: "User not registered",
          passwordMatch: false,
        });
      }
    } catch (error) {
      console.log(error.response);
      // console.error("Error during login:", error);
      // res.status(500).send({ message: "Internal Server Error" });
    }
  });

app
  .route("/register")
  .get(redirectHome, (req, res) => {
    res.render(
      "/Users/abhishekhanchinal/Desktop/temp/wt/WT_Project_SUNDAY/WT_Course_Project/src/components/Register.jsx"
    );
  })
  .post(redirectHome, async (req, res) => {
    //   res.header("Access-Control-Allow-Origin");
    console.log("Received register request:", req.body);
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        res.send({ message: "User already registered" });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // const token = await newUser.generateAuthToken(); // CALLING generateAuthToken() function for /register page
        // console.log("TOKEN : " + token);

        // res.cookie("jwt", token, {
        //   maxAge: 60000,
        //   httpOnly: true,
        // });

        await newUser.save((err, docs) => {
          if (err) {
            redirect("/register");
          } else {
            console.log(docs);
            req.session.user = docs;
          }
        });

        let transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_MAIL, // generated ethereal user
            pass: process.env.SMTP_PASSWORD, // generated ethereal password
          },
        });

        var mailOptions = {
          from: process.env.SMTP_MAIL,
          to: email,
          subject: "Conference Registeration Notification",
          text: `Dear ${name}, We and invite you to speak at the IFSC on 30/01/2024. Kindly adhere to the submission deadline of 25/01/2024. Your valuable contribution would greatly enrich our conference. `,
          // html: '<a href="localhost:3000/">Link</a>',
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.send(error);
          } else {
            res.send({
              message:
                "Email sent and Successfully Registered, Please login now.",
            });
          }
        });

        // res.send({ message: "Successfully Registered, Please login now." });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // console.log(error.response);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

app.post("/login_rev", redirectHome, async (req, res) => {
  console.log("Received login request:", req.body);
  try {
    const { email, password } = req.body;
    const user = await reviewer.findOne({ email: email });
    console.log(user);

    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successful", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "Reviewer not registered" });
    }
  } catch (error) {
    console.log(error.response);
    // console.error("Error during login:", error);
    // res.status(500).send({ message: "Internal Server Error" });
  }
});

const upload = multer({ storage: storage });

app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request title:", req.body.title);
  console.log("Request domain:", req.body.domain);
  console.log("Request email:", req.body.email);
  console.log("Request file/pdf:", req.file.filename);

  // const email = req.body.email;
  // const userEmail = "userEmail";
  const title = req.body.title;
  const userEmail = req.body.email;
  const fileName = req.file.filename;
  const domain = req.body.domain;

  try {
    await PdfSchema.create({
      title: title,
      pdf: fileName,
      email: userEmail,
      domain: domain,
    });
    res.send({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", message: "Error submitting PDF" });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});

// app.get("/get-files", async (req, res) => {
//   try {
//     // const userEmail = req.session.email; // Assuming user's email is stored in the session
//     // console.log("tttttttttt " + userEmail);
//     // const userEmail = res.locals.user.email;
//     // if (!userEmail) {
//     //   return res.status(401).send({ status: "error", message: "Unauthorized" });
//     // }

//     // const sessionData = res.locals.sessionData;
//     // console.log("ddddddddd " + sessionData.email);

//     // const userr = res.locals;
//     // console.log("yyyyyyyy" + userr.email);

//     // console.log("req . session" + req.session);
//     // const userId = req.session.userID;
//     // console.log("aaaaaaaaa " + userId);
//     // const user = await User.findOne({ _id: userId });
//     // console.log("bbbbbbbbb " + user);
//     // const userEmail = user.email;
//     // console.log("ccccccccc " + userEmail);

//     // const userEmail = user.email;
//     // console.log("aa gaya email: " + userEmail)

//     PdfSchema.find({ email: userEmail }).then((data) => {
//       res.send({ status: "ok", data: data });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "error", message: "Internal Server Error" });
//   }
// });

app.post("/get-files", async (req, res) => {
  try {
    // Extract user information from the request body
    const user = req.body.user;
    console.log("tttttttt: " + user.email);

    // Use user information to fetch files associated with the user
    const data = await PdfSchema.find({ email: user.email });
    res.send({ status: "ok", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

app.use("/files", express.static("files"));

app.get("/get-reviewed-papers/:domain", async (req, res) => {
  const { domain } = req.params;

  try {
    const reviewedPapers = await PdfSchema.find({ domain })
      .select("pdf domain paper email")
      .limit(2);
    res.send({ status: "ok", data: reviewedPapers });
  } catch (error) {
    console.error("Error fetching reviewed papers:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// Update route
app.post("/updateAttribute", async (req, res) => {
  const { email, newPaperStatus, comments } = req.body;

  try {
    // Find and update the document by author_id
    const updatedAuthor = await PdfSchema.findOneAndUpdate(
      { email: email },
      { $set: { paper_status: newPaperStatus, comments: comments } },
      { new: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// const createToken = async () => {
//   const token = await jwt.sign(
//     { _id: "12345678910" },
//     "abhishekrajkumarabhishekrajkumar"
//   );
//   console.log(token);

//   const userVer = await jwt.verify(token, "abhishekrajkumarabhishekrajkumar");
//   console.log(userVer);
// };

// createToken();

//apis----------------------------------------------------------------
// app.get("/", async (req, res) => {
//   res.send("Success!!!!!!");
// });

// app.get("/authorConsole", async (req, res) => {
//   // try {
//   //   if (!req.session.userID) return res.redirect("/login");
//   // } catch (error) {
//   //   res.send(error);
//   // }
// });

app
  .route("/authorConsole")
  .get(isAuth, (req, res) => {
    res.render(
      "/Users/abhishekhanchinal/Desktop/temp/wt/WT_Project_SUNDAY/WT_Course_Project/src/components/author-console.jsx"
    );
  })
  .post();

app.post("/logout", (req, res) => {
  // try {
  //   req.session.destroy((err) => {
  //     if (err) {
  //       console.error("Error destroying session:", err);
  //       res.status(500).send("Unable to log out");
  //     } else {
  //       res.clearCookie("user_sid");
  //       res.redirect("/login");
  //     }
  //   });
  // } catch (error) {
  //   console.error("Unexpected error during logout:", error);
  //   res.status(500).send("Internal Server Error");
  // }
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie("user_sid");
    res.redirect("/login");
  });
});

app.listen(7500, () => {
  console.log("Server Started");
});
