const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file) {
    const imageFile = await toFile(
        file.buffer,
        file.originalname
    );

    const response = await imagekit.files.upload({
        file: imageFile,
        fileName: file.originalname,
    });

    return {
        url: response.url,
        fileId: response.fileId,
    };
}

module.exports = uploadFile;