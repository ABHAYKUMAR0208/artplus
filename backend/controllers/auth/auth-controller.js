const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User.js');

// Register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: 'User already exists with the same email! Please try again',
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: 'Registration Successful',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred',
    });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: 'User does not exist! Please register first',
      });
    }

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: 'Password Incorrect! Please try again',
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName : checkUser.userName,
      },
      'CLIENT.SECRET_KEY',
      { expiresIn: '1h' }
    );

    res
      .cookie('token', token, { httpOnly: true, secure: false })
      .json({
        success: true,
        message: 'Login Successful',
        user: {
          id: checkUser._id,
          role: checkUser.role,
          email: checkUser.email,
          userName : checkUser.userName,
        },
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred',
    });
  }
};

//logout
const logoutUser = (req, res)=>{
  res.clearCookie('token').json({
    success: true,
    message: 'Logged out successfully',
  })
}

//auth middleware
const authMiddleware = async(req,res,next)=>{
  const token = req.cookies.token;
  if(!token) return res.status(401).json({
    success: false,
    message: 'Unauthorized User. Please login first!',
  })

  try{
    const decoded = jwt.verify(token, 'CLIENT.SECRET_KEY');
    req.user = decoded;
    next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized User!',
      })
  }
}

// Export both functions
module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
