import AWS from "aws-sdk";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_CLOUDINARY_API_SECRET,
});


export function removeUrlUnfriendlyCharacters(str: string): string {
  const unfriendlyCharacters = /[^a-zA-Z0-9-_.]/g;
  return str.replace(unfriendlyCharacters, '');
}

/**
 * Upload image to AWS S3
 * @param image - Object containing image data, name, and type
 */
export const uploadToS3 = async (image: { name: string; data: string; type: string }): Promise<string> => {
  const buffer = Buffer.from(image.data.split(",")[1], "base64");
  const imageName = removeUrlUnfriendlyCharacters(image.name)
  const uniqueFileName = `${uuidv4()}-${imageName}`;
  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: uniqueFileName,
    Body: buffer,
    ContentType: image.type,
  };

  const result = await s3.upload(s3Params).promise();
  return result.Location; // URL of the uploaded image
};

/**
 * Upload image to Cloudinary
 * @param image - Object containing image data and name
 */
export const uploadToCloudinary = async (image: { data: string; name: string, type: string }): Promise<string> => {
  const imageName = removeUrlUnfriendlyCharacters(image.name)
  const result = await cloudinary.uploader.upload(image.data, {
    folder: "product_images", // Optional: specify folder
    public_id:`${uuidv4()}-${imageName}`, // Optional: use the file name without extension
    resource_type: "image",
  });

  return result.secure_url; // URL of the uploaded image
};
