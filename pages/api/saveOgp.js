import fs from "fs";

export default async function handler(buffer, id) {
  fs.writeFileSync(path.resolve(`./public/ogp/${id}.png`), buffer);
}
