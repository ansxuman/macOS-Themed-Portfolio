import { ansxuman } from './devInfo';

export const fileSystem: FileSystem = {
  home: {
    about: `
Name: ${ansxuman.name}
Role: ${ansxuman.role}
Company: ${ansxuman.company}

About:
${ansxuman.about}

Programming Languages:
${ansxuman.code.join(', ')}

Operating Systems:
${ansxuman.operatingSystems.join(', ')}

Tools Used:
${ansxuman.toolsUsed.join(', ')}

IDEs:
${ansxuman.ides.join(', ')}
    `,
    projects: {
    },
    interests: `
${ansxuman.interests.join('\n')}
    `,
  },
};

export interface FileSystem {
  [key: string]: string | FileSystem;
}