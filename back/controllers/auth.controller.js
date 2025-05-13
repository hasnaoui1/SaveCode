const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User , Snippet } = require('../models');  


exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;


  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  try {
   
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

 
    

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET, 
    { expiresIn: '12h' }
  );

  res.status(200).json({
    message: 'Login successful',
    
    token, 
  });
};



exports.getAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [{ model: Snippet, separate: true, order: [['createdAt', 'DESC']] }], 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
