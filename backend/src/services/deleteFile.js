const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function deleteFile(fileId) {
    const response = await imagekit.files.delete(fileId);

    return response;
}

module.exports = deleteFile;