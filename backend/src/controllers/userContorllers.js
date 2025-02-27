
const regiesterUser = async (req, res) => {
    try {
      /// decomposing data
      let { fullName, email, password, contact } = req.body;
      /// chechk if any data is null
      if (!fullName || !email || !password || !contact) {
        return res.status(204).send("All fields are required");
      }
      /// chechk if existed
      let user = await userModel.findOne({ email: email });
      if (user) {
        return res.status(401).send("User already existed");
      } // if does not exist
      else {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) {
            return res.status(500).res("try again later");
          }
          bcrypt.hash(password, salt, async function (err, hash) {
            //creating new user
            let createdUser = await userModel.create({
              fullName,
              email,
              password: hash,
              contact,
            });
            // generating token
            let token = generateToken(createdUser);
            res.cookie("token", token);
  
            res.status(200).send("user Created successfuly");
          });
        });
      }
    } catch (error) {
      res.send(error.message);
    }
  };

module.exports = {regiesterUser};