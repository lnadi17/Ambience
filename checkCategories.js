const fs = require('node:fs');
const path = require('node:path');
const categories = require('./dist/data/categories.js');
const {demuxProbe} = require("@discordjs/voice");
const {createReadStream} = require("node:fs");

// Loop over all categories and make sure they exist in the sounds folder
categories.default.forEach((category) => {
    const dir = path.join(__dirname, 'sounds', category.name);
    if (!fs.existsSync(dir)) {
        throw new Error(`Category ${category.name} does not exist in the sounds folder`);
    } else {
        // console.log(`Category ${category.name} exists`);
        const results = category.songs.map((song) => {
            const file = path.join(dir, song.title);
            if (!fs.existsSync(file + '.opus')) {
                // Demux probe
                throw new Error(`Song ${song.title} does not exist in the ${category.name} folder`);
            } else {
                // console.log(`Song ${song.title} exists`);
                return [demuxProbe(createReadStream(file + '.opus')), file];
            }
        });
        const promises = results.map((result) => result[0]);
        const files = results.map((result) => result[1]);

        Promise.all(promises).then((probeInfos) => {
            probeInfos.forEach((probeInfo, index) => {
                const file = files[index];
                if (probeInfo.type !== 'ogg/opus') {
                    throw new Error(`Song ${file} is not an opus file. it is "${probeInfo.type}"`);
                } else {
                    // console.log(file, probeInfo.type)
                }
            });
        }).then(() => {
            console.log(`Category ${category.name} is OK.`);
        });
    }
});

