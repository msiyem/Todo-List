import fs from "fs";

export const readJSON = (path) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, "[]");
  }
  return JSON.parse(fs.readFileSync(path));
};

export const writeJSON = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};