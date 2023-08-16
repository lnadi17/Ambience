import { getSongsFromData} from "./getCommands";
import categories from "../data/categories";

const songs = getSongsFromData(categories);

// export function matchSongByName(title: any) {
//     let purifiedTitle = getPurifiedInput(title);
//     for (let song of sounds) {
//         let purifiedSongName = getPurifiedInput(song.name);
//         if (purifiedSongName == purifiedTitle) {
//             return song.link;
//         }
//     }
//     return false;
// }


// export function matchSongByCategoryIndex(content: any) {
//     let results = content.split(" ");
//     if (matchCategoryByName(results[0])) {
//         let categorySongs = getSongsForCategory(results[0]);
//         if (categorySongs[results[1] - 1]) {
//             return categorySongs[results[1] - 1].link;
//         } else {
//             // give user a descriptive error message
//             return false;
//         }
//     }
//     return false;
// }

// export function matchCategoryByName(name: any) {
//     let purifiedInput = getPurifiedInput(name);
//
//     for (let category of categories) {
//         let categoryName = category.name.toLowerCase();
//         if (categoryName == purifiedInput) {
//             return category;
//         }
//     }
//
//     return false;
// }

// module.exports = {
//     matchCategoryByName: matchCategoryByName,
//     matchSongByCategoryIndex: matchSongByCategoryIndex,
//     matchSongByName: matchSongByName
// };