const multer = require("multer");

// Store uploaded files temporarily in memory
const storage = multer.memoryStorage();

// Only allow image files
const fileFilter = (req, file, cb) => {
    console.log("Received file:", file.originalname, file.mimetype);

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    ];

    const fileExtension = file.originalname
        .toLowerCase()
        .substring(file.originalname.lastIndexOf("."));

    if (
        allowedMimeTypes.includes(file.mimetype) ||
        allowedExtensions.includes(fileExtension)
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."), false);
    }
};


// Configure upload settings
const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB per image
        files: 5                    // Maximum 5 images
    },

    fileFilter: fileFilter
});

module.exports = upload;