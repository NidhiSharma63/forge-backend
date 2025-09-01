import express from "express";
import { loginUser, logout, registerUser } from "../controller/auth.js";
import {
  addImage,
  deleteImage,
  getAllImages,
  getSingleImage,
  uploadImage,
} from "../controller/image.js";
import {
  createTemplate,
  deleteTemplate,
  getAllUserTemplate,
  getSingleTemplate,
  updateTemplate,
} from "../controller/template.js";
import checkAuthorization from "../middleware/checkAuthorization.js";
const router = express.Router();

/**
 * Auth route
 */
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(checkAuthorization, logout);

/**
 * Template route
 */
router.route("/createTemplate").post(checkAuthorization, createTemplate);
router.route("/updateTemplate").post(checkAuthorization, updateTemplate);
router.route("/deleteTemplate").post(checkAuthorization, deleteTemplate);
router.route("/allTemplate").get(checkAuthorization, getAllUserTemplate);
router.route("/singleTemplate").get(checkAuthorization, getSingleTemplate);

/***
 * Image route
 */
router.route("/addImage").post(checkAuthorization, addImage);
router.route("/singleImage").get(checkAuthorization, getSingleImage);
router.route("/allImages").get(checkAuthorization, getAllImages);
router.route("/deleteImage").post(checkAuthorization, deleteImage);
router.route("/upload-file-direct").post(checkAuthorization, uploadImage);

export default router;
