import { createClient } from "@supabase/supabase-js";
import Image from "../models/imageSchema.js";

// ✅ Initialize Supabase with service role key (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Add image (append in user's urls array)
export const addImage = async (req, res, next) => {
  try {
    const { userId, url } = req.body;
    if (!userId) throw new Error("userId is missing");
    if (!url) throw new Error("url is missing");

    // create new image document
    const imageDoc = await Image.create({ userId, url });

    res.status(200).json(imageDoc);
  } catch (error) {
    next(error);
  }
};

// Delete image
export const deleteImage = async (req, res, next) => {
  try {
    const { userId, url } = req.body;
    if (!userId) throw new Error("userId is missing");
    if (!url) throw new Error("url is missing");

    const imageDoc = await Image.findOneAndDelete({ userId, url });

    if (!imageDoc) throw new Error("No such image found");

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all images (user's urls array)
export const getAllImages = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) throw new Error("userId is missing");

    // sort by createdAt descending (latest first)
    const imageDoc = await Image.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(imageDoc);
  } catch (error) {
    next(error);
  }
};
// Get single image (user's urls array)
export const getSingleImage = async (req, res, next) => {
  try {
    const { userId, url } = req.query;
    if (!userId) throw new Error("userId is missing");
    if (!url) throw new Error("url is missing");
    const imageDoc = await Image.findOne({ userId, url });
    if (!imageDoc) throw new Error("No images found for this user");
    res.status(200).json(imageDoc);
  } catch (error) {
    next(error);
  }
};

// ✅ Generate signed URL for upload
export const uploadImage = async (req, res, next) => {
  try {
    const { fileName, fileBase64 } = req.body;
    if (!fileName || !fileBase64)
      throw new Error("Missing fileName or fileBase64");

    const buffer = Buffer.from(fileBase64, "base64");

    const { data, error } = await supabase.storage
      .from("Images")
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/Images/${fileName}`;
    res.status(200).json({ publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
