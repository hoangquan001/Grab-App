const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { User } = require('../../models');
const { redisClient, setBlockedToken } = require('../../utils/redis');
const { disconnectSocketByUserId, disconnectSocketByToken } = require('../../../socket');

async function signUp(args, _context, _info) {
  try {
    const { username, password, role } = args.userInput;
    const existedUser = await User.findOne({ username }).lean();
    if (existedUser) {
      return {
        isSuccess: false,
        message: 'Username invalid or already taken',
      };
    }
    if (role === 'Admin') {
      return {
        isSuccess: false,
        message: 'Cannot create admin account',
      };
    }
    const hashedPassword = await argon2.hash(password);
    const { userInput } = args;
    userInput.password = hashedPassword;
    const user = await User.create(userInput);
    return {
      isSuccess: true,
      message: 'Sign up successfully',
      user,
    };
  } catch (err) {
    return {
      isSuccess: false,
      message: err,
    };
  }
}

async function login(args, _context, _info) {
  const { username, password } = args;
  try {
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return {
        isSuccess: false,
        message: 'Invalid Credentials!',
      };
    }

    const match = await argon2.verify(user.password, password);
    if (!match) {
      return {
        isSuccess: false,
        message: 'Invalid Credentials!',
      };
    }

    if (user.isActive === false) {
      return {
        isSuccess: false,
        message: 'Invalid Credentials!',
      };
    }
    const token = jwt.sign({ userId: user._id }, config.jwt.secretKey, { expiresIn: config.jwt.expireTime });

    return {
      isSuccess: true,
      message: 'Login successfully',
      token,
      user,
    };
  } catch (err) {
    return {
      isSuccess: false,
      message: err,
      token: null,
    };
  }
}

async function logout(args, _context, _info) {
  try {
    const { token } = _context;
    setBlockedToken(token, config.jwt.expireTime);
    disconnectSocketByToken(token);
    return {
      isSuccess: true,
      message: 'logout success',
    };
  } catch (err) {
    return {
      isSuccess: false,
      message: err,
    };
  }
}

async function activateDriver(args, context) {
  const { username, deactivate } = args;
  const { userRole } = context.signature;
  if (userRole !== 'Admin') {
    return {
      isSuccess: false,
      message: 'You must be an Admin',
    };
  }
  const user = await User.findOne({ username }).lean();
  if (!user) {
    return {
      isSuccess: false,
      message: 'User not found',
    };
  }
  if (user.role !== 'Driver') {
    return {
      isSuccess: false,
      message: 'User must be a Driver',
    };
  }
  let driver = null;
  // Update db
  if (deactivate) {
    if (user.status === 'Deactivated' || user.status === 'Pending') {
      return {
        isSuccess: false,
        message: 'Driver has already been deactivated',
      };
    }

    driver = await User.findByIdAndUpdate(user.id, { status: 'Deactivated' }, { new: true })
      .lean();
  } else {
    if (user.status === 'Active') {
      return {
        isSuccess: false,
        message: 'Driver has already been deactivated',
      };
    }
    driver = await User.findByIdAndUpdate(user.id, { status: 'Active' }, { new: true })
      .lean();
  }
  // Disconnect socket
  disconnectSocketByUserId();

  // Caching
  redisClient.del(driver._id.toString());

  return {
    isSuccess: true,
    message: deactivate
      ? 'Deactivate driver successfully'
      : 'Activate driver successfully',
    driver,
  };
}

module.exports = {
  logout,
  signUp,
  login,
  activateDriver,
};
