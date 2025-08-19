import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";

// register
const registerUser = async (req, res, next) => {
  try {
    const { email, password, username, uniqueBrowserId } = req.body;

    if (!email || !password || !email.trim() || !password.trim()) {
      throw new Error("Missing email or password");
    }

    const isAlreadyPresentEmail = await User.findOne({ email });
    if (isAlreadyPresentEmail) throw new Error("Email already exists");

    const isUserNamePresent = await User.findOne({ username });
    if (isUserNamePresent) throw new Error("Username already exists");

    if (!uniqueBrowserId) throw new Error("uniqueBrowserId is missing");

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, username, password: hashPassword });

    // generate token (only update tokens array in user object)
    const token = user.generateAuthToken(uniqueBrowserId);

    // save with token
    await user.save();

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

// login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password, uniqueBrowserId } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid login detail");
    if (!uniqueBrowserId) throw new Error("uniqueBrowserId is Missing");

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) throw new Error("Invalid login detail");

    // generate new token
    const token = await user.generateAuthToken(uniqueBrowserId);

    // filter out to keep only current browser token
    const updatedUserWithToken = user.tokens.filter(
      (item) => item.uniqueBrowserId === uniqueBrowserId
    );
    user.tokens = updatedUserWithToken;

    await user.save();

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};
// logout page
const logout = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!userId) {
      throw new Error("UserId is Missing");
    }
    if (!token) {
      throw new Error("Token is Missing");
    }
    const getUserFromDB = await User.findOne({ _id: userId });
    if (getUserFromDB) {
      // updating token
      const updatedToken = getUserFromDB.tokens.filter(
        (item) => item.token !== token
      );
      getUserFromDB.tokens = updatedToken;
      // saving user to database after updatig the token
      await getUserFromDB.save();
    }
    res.status(202).json({ message: "successfully logged out" });
  } catch (error) {
    next(error);
  }
};

/**
 * get user by id
 */

const getUser = async (req, res, next) => {
  const { id } = req.query;
  // console.log({ id });
  try {
    const getUser = await User.findOne({ _id: id }).setOptions({ lean: true });
    res.status(200).json(getUser);
  } catch (error) {
    next(error);
  }
};

/**
 * get all user
 */

const getAllUser = async (req, res, next) => {
  try {
    const getAllUsers = await User.find().setOptions({ lean: true });
    res.status(200).json(getAllUsers);
  } catch (error) {
    next(error);
  }
};
/**
 * update user
 */

const updateUser = async (req, res, next) => {
  const { userId, file, bio } = req.body;
  try {
    const getUser = await User.findOne({ _id: userId });
    /**
     * check if username is present
     *
    /** update user */
    if (getUser) {
      // getUser.username = username;
      getUser.avatar = file;
      getUser.bio = bio;
    }
    await getUser?.save();
    res.status(200).json(getUser);
  } catch (error) {
    next(error);
  }
};

export { getAllUser, getUser, loginUser, logout, registerUser, updateUser };
