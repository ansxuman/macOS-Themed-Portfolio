import { ansxuman } from "./devInfo";
import { syncProjectsToFileSystem } from "./syncProjects";

export const fileSystem: FileSystem = {
  home: {
    about: `
${ansxuman.about}

Programming Languages:
${ansxuman.code.join(", ")}

Operating Systems:
${ansxuman.operatingSystems.join(", ")}

Tools Used:
${ansxuman.toolsUsed.join(", ")}

IDEs:
${ansxuman.ides.join(", ")}
    `,
    projects: {},
    interests: `
${ansxuman.interests.join("\n")}
    `,
  },
};

syncProjectsToFileSystem(fileSystem);

export interface FileSystem {
  [key: string]: string | FileSystem;
}
