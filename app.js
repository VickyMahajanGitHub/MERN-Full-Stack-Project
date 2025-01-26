if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing=require("./models/listing");
const path=require("path");
const methodoverride = require("method-override");
const ejsMate=require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

//connecting to database
//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));  // for parsing
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// Mongo Session Store
const store= MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error",() => {
  console.log("error in mongo SESSION STORE",err);
}); 

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  }
}

// Basic API
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

// Authentication- Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next )=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
});

// Demo user
// app.use("/demouser", async (req, res, next) => {
//   let fakeuser=new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });
//   let registeredUser=await User.register(fakeuser,"helloworld");
//   res.send(registeredUser);
// });

app.use("/listings",listingRouter); // All listing routes
app.use("/listings/:id/reviews",reviewRouter); // All review routes
app.use("/",userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404,"Page Not Found!"));
})

// Error handling middleware
app.use((err, req, res, next) => {
  let {statusCode=500, message="Something went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{message});
  //res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("server is listening to port: 3000");
});
