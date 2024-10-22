import { ansxuman } from './devInfo';

export interface FileSystem {
  [key: string]: string | FileSystem;
}

export const fileSystem: FileSystem = {
  home: {
    about: JSON.stringify(ansxuman, null, 2),
    projects: {
    },
    interests: JSON.stringify(ansxuman.interests, null, 2),
  },
};