/** @format */

require("dotenv").config();
const multer = require("multer");
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const upload = multer({ dest: "uploads/" });

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

const app = express();

app.use(cors());

app.use(express.json());

app.post("/upload_image", upload.single("image"), uploadImage);

app.get("/images", listImages);

function uploadImage(req, res) {
	cloudinary.uploader.upload(
		req.file.path,
		{
			public_id: req.file.filename,
			folder: "cloudinary-test",
		},
		() => {
			res.json({ message: "Successfully uploaded image" });
		}
	);
}

function listImages(req, res) {
	cloudinary.api.resources(
		{
			type: "upload",
			prefix: "cloudinary-test",
		},
		(err, result) => {
			if (err) {
				res.status(500).send(err);
			} else {
				const transformed = result.resources.map((r) => {
					const transformedUrl = cloudinary
						.image(r.public_id, {
							use_root_path: true,
							transformation: [
								{ width: 500, crop: "scale" },
								{ overlay: "radialize", effect: "displace", x: 20 },
								// {
								// 	overlay: "cloudinary-test/793f98b28296d5616a117fed880bde78",
								// 	// effect: "displace",
								// 	width: 250,
								// 	height: 250,
								// 	y: 20,
								// 	x: 20,
								// 	// angle: 90,
								// },
							],
						})
						.replace("<img src='", "")
						.replace("' />", "");

					console.log(transformedUrl);

					return { transformedUrl, ...r };
				});

				res.json(transformed);
			}
		}
	);
}

app.listen(5000, () => {
	console.log(`Server started...`);
});
