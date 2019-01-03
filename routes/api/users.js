const express = require('express')
const router = express.Router()
const gravatar = require('gravatar');
const bcrypt   = require('bcryptjs');
const keys     = require('../../config/keys');
const jwt      = require('jsonwebtoken');

//load the model

const User = require('../../models/User')

//@route  GET api/users/test
//@dec    TEST users route
//@access Public
router.get('/test', (req, res) => res.json({msg: 'users works'}))


//@route  POST api/users/register
//@dec    register route
//@access Public
router.post('/register', (req, res) => {
      User.findOne({email: req.body.email})
          .then( user => {
                if(user){
                  return res.status(400).json({email: 'Email Already Exists'});
                } else {

                    const avatar  = gravatar.url(req.body.email, {
                        s: '200', //size
                        r: 'pg',  //rating
                        d: 'mm',  //Default
                    })


                    const newUser = new User({
                      name: req.body.name,
                      email: req.body.email,
                      password: req.body.password,
                      image: avatar
                    })

                    //hashing password
                    bcrypt.genSalt(10, (err, salt) => {
                      bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err
                        newUser.password = hash;
                        newUser.save()
                              .then( user  => res.json(user))
                              .catch( err => console.log(err))
                      })
                    })

                }
          })
})

//@route  POST api/users/login
//@dec    login route return JWT token;
//@access Public
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({email})
      .then( user => {
        if(!user){
          return res.status(404).json({email: 'Email Not Found!'});
        }

        bcrypt.compare(password, user.password)
              .then(isMatch => {
                  if(isMatch){

                    //User Matched
                    const payload = {id: user.id, name: user.name, email: user.email, image: user.image} //create JWT payload

                    //sign token

                    jwt.sign(payload, keys.secretKey, {expiresIn: 3600}, (err, token) => {
                                                                              res.json({
                                                                                success: true,
                                                                                token: 'Bearer ' + token
                                                                              })
                                                                          })

                  } else {
                    return res.status(404).json({passw: 'Password incorrect!'});
                  }
              }).catch( err => console.log(err))

      }).catch( err => console.log(err))
})


module.exports = router
