import { User } from "../models/user.model.js";
import uploadFileOnCloud from "../utils/cloudinary.js";

export const userController = async (req, res, next) => {
  const { email, userName, fullName, password } = req.body;

  if (
    [email, userName, fullName, password].some((field) => field.trim === "")
  ) {
    next(new Error("Alll fields are required"));
  }

  const exisitingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (exisitingUser) {
    return res.status(409).send("User Already exists");
  }

  const avatarLocalFilePath = req?.files?.avatar[0]["path"];
  const coverImagePath = req?.files?.coverImage[0]["path"];

  if (!avatarLocalFilePath) {
    return res.status(400).send("File is required");
  }

  const avatar = await uploadFileOnCloud(avatarLocalFilePath);
  const coverImage = await uploadFileOnCloud(coverImagePath);

  if (!avatar)
    res.status(400).send("Avatar File is not uploaded on cloudiniary");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser)
    res.status(500).send("Something went wrong while registring to User");

  return res.status(201).json(createUser);
};
