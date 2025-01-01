import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router(); // creating router

router.route("/register").post(
  upload.fields([
    // injecting middleware
    {
      // field 1
      name: "avatar", // jab apka frontend ka field banay ga tab bhi ap uska name avatar hi rakho gay ye communication hona lazmi ha frontend or backend engineers ma
      maxCount: 1,
    },
    {
      // field 2
      name: "coverImage",
      maxCount: 1,
    },
  ]), // array execept karta ha
  // array isi leya nahi leya q k array ik hi field ma multiple files hoti ha // humay fields chaheya
  registerUser
); // register route par koi bhi request kar raha ha to ye method execute ho jata ha // ma chahta hu ye method to execute ho jai magar jatay huya mujhsey mil kar jana isi leya "upload" import karwa ha

router.route("/login").post(loginUser);

/* secured routes */ // it means user loggedin hona chaheya

router.route("/logout").post(verifyJwt, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJwt, changeCurrentPassword);

router.route("/current-user").get(verifyJwt, getCurrentUser);

router.route("/update-account").patch(verifyJwt, updateAccountDetails); // patch warna post ma sari details hi update ho jai gi

router
  .route("/avatar")
  .patch(verifyJwt, upload.single("avatar"), updateUserAvatar); // upload.single for getting single file using multer

router
  .route("/cover-image")
  .patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJwt, getUserChannelProfile);
// collon ka bad jo liko gay ap username wohi apko end point ma milay ga "getUserChannelProfile" is endpoint me destructure kartay waqt name username likha ja isi leya url ma bhi username hi ana ha

router.route("/history").get(verifyJwt, getWatchHistory);

export default router;
