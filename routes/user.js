const express = require("express");
const router = express.Router();
const { User, validateUser, validateLoginRequest } = require("../models/User");
const passwordHash = require("password-hash");
const jwt = require("../util/jwt-auth");
const _ = require("underscore");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require('nodemailer');

// const DIR = "./uploads/";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/img"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({ storage: storage });
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  let userid = jwt.getDataFromToken(req.get("token"));
  let user = await User.findById(userid);
  if (!user) return res.status(404).send("User not found");

  return res.send(user);
});

router.post("/", async (req, res) => {
  let { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    username: req.body.username,
    password: passwordHash.generate(req.body.password),
    email: req.body.email,
    birthday: req.body.birthday,
    country: req.body.country,
    isAdmin: false,
    photo: "http://localhost:3000/img/avatar.png",
    isEnabled: true,
    timesBadPost: 0
  });
  user = await user.save();
  const retUser = _.pick(user, ["_id", "username", "isAdmin", "email"]);

  jwt
    .generate(JSON.stringify(retUser))
    .then((token) => {
      return res.send({ token: token });
    })
    .catch((error) => {
      return res.send({ error: error });
    });
});

router.post("/login", async (req, res) => {
  let { error } = validateLoginRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).send("User not found");
  }

  if (
    !(
      passwordHash.verify(req.body.password, user.password) &&
      user.username == req.body.username
    )
  ) {
    // Invalid user
    return res.status(400).send("Username or password incorrect");
  }
  const retUser = _.pick(user, [
    "_id",
    "username",
    "email",
    "isAdmin",
    "isEnabled",
    "timesBadPost",
  ]);
  jwt
    .generate(JSON.stringify(retUser))
    .then((token) => {
      return res.send({ token: token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
});

router.post("/search", async (req, res) => {
  const userid = jwt.getDataFromToken(req.get("token"));
  const me = await User.findById(userid);
  var users = await User.find({ username: new RegExp(req.body.username) });

  var retList = [];
  if (users.length > 0) {
    for (let index in users) {
      var tmp = _.pick(users[index], ["_id", "username", "country", "photo"]);

      if (me.followers.includes(tmp._id)) {
        tmp.flwdFlg = true;
      } else {
        tmp.flwdFlg = false;
      }
      retList.push(tmp);
    }
  }

  return res.send({ users: retList });
});

router.post("/follower", async (req, res) => {
  let userid = jwt.getDataFromToken(req.get("token"));
  const result = await User.findByIdAndUpdate(userid, {
    $push: { followers: req.body.follower },
  });
  if (result) {
    return res.send({ msg: "success" });
  } else {
    return res.status(404).send({ msg: "error" });
  }
});

router.post("/photo/:username", upload.single("file"), async (req, res) => {
  if (!req.file) {
    console.log("your request doesn't have any file");
    return res.send({ success: false });
  } else {
    console.log(req.file);
    const user = await User.updateOne(
      { username: req.params.username },
      { photo: "http://localhost:3000/img/" + req.file.filename }
    );
    return res.send({ success: true });
  }
});

router.get("/follower", async (req, res) => {
  let userid = jwt.getDataFromToken(req.get("token"));
  const user = await User.findById(userid);
  let followersArr = user.followers;

  let followerObjArr = [];
  for (follower of followersArr) {
    const f = await User.findById(follower);
    const ff = _.pick(f, ["_id", "username", "country", "photo"]);
    followerObjArr.push(ff);
  }

  return res.send({ followers: followerObjArr });
});

router.post("/unfollow", async (req, res) => {
  const toUnfollow = req.body.unfollow;
  const userid = jwt.getDataFromToken(req.get("token"));
  const user = await User.findByIdAndUpdate(
    userid,
    {
      $pull: { followers: toUnfollow },
    },
    { new: true }
  );

  return res.send({ msg: "success" });
});

router.post("/updateBadPost", async (req, res) => {
  const userid = jwt.getDataFromToken(req.get("token"));
  console.log("the id is "+JSON.stringify(userid["_id"]));

  const user = await User.findByIdAndUpdate(
    { _id: userid["_id"] },
    {
      $inc: {timesBadPost: 1},
    },
    { upsert: true },
    function(err, result) {
      if (err) {
        console.log("error "+err);
        return res.send(err);
      } else {
        console.log("result "+result);
        return res.send(result);
      }
    }
  );

});

router.post("/disabledUserPost", async (req, res) => {
  const userid = jwt.getDataFromToken(req.get("token"));
  console.log("the id is "+JSON.stringify(userid));

  const user = await User.findByIdAndUpdate(
    { _id: userid["_id"] },
    {
      isEnabled: false,
    },
    function(err, result) {
      if (err) {
        console.log("error "+err);
        return res.send(err);
      } else {
        console.log("result "+result);
        sendMail(userid);
        return res.send(result);
      }
    }
  );

});


sendMail = (userid)=>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mwaproject2020@gmail.com',
      pass: 'Password01@'
    }
  });
  
  var mailOptions = {
    from: 'mwaproject2020@gmail.com',
    to: JSON.stringify(userid["email"]),
    subject: 'Account disabled',
    text: 'You have post more than 20 unhealthy post. Your account has been disabled forever!!!!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  
}

module.exports = router;
