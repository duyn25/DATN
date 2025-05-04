const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: "drcbnl87j",
    api_key: "952313431671942",
    api_secret: "nURlyhp039zDhtOaLgRBzE2eKcM",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file){
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "auto"
    });
    return result;
}

const upload = multer({storage});
module.exports = {upload,imageUploadUtil};