import fs from "fs/promises";
import { Request } from "express";
import multer from "multer";
import config from "../config.js";

const uploadFolder = config.basePath;

const diskStorage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, _destination: string) => void,
  ) => {
    cb(null, uploadFolder);
  },
  filename: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, `${Date.now()}`);
  },
});

const trashFolder = config.trashPath;
const fileManager = {
  trash: (path: string) => {
    const filepath = path.split("/");
    const filename = filepath[filepath.length - 1];
    return new Promise((resolve, reject) => {
      fs.rename(path, `${trashFolder}/${filename}`)
        .then(() => {
          console.log(`trashing ${path} successful`);
          resolve(true);
        })
        .catch((err) => {
          console.error(`trashing ${path} failed`, err);
          reject(false);
        });
    });
  },

  delete: (path: string) => {
    const filepath = path.split("/");
    const filename = filepath[filepath.length - 1];
    return new Promise((resolve, reject) => {
      fs.unlink(`${trashFolder}/${filename}`)
        .then(() => {
          console.log(`deleting ${path} successful`);
          resolve(true);
        })
        .catch((err) => {
          console.error(`deleting ${path} failed.`, err);
          reject(false);
        });
    });
  },

  move: (src: string, dest: string) => {
    return new Promise((resolve, reject) => {
      fs.rename(src, dest)
        .then(() => {
          console.error(`moving ${src} to ${dest} successful`);
          resolve(true);
        })
        .catch((err) => {
          console.log(`moving ${src} to ${dest} failed`, err);
          reject(false);
        });
    });
  },
};

const upload = multer({ storage: diskStorage });

export default { upload, fileManager };
