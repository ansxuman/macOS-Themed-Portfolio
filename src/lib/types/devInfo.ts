export interface Developer {
    code: string[];
    interests: string[];
    operatingSystems: string[];
    toolsUsed: string[];
    ides: string[];
  }
  
  export const ansxuman: Developer = {
    code: ["Golang", "Svelte", "Angular", "TS", "JS", "Java", "Swift", "Rust"],
    interests: [
      "Full-Stack Development",
      "Cybersecurity",
      "DevOps",
      "Writing Blogs",
      "Experimenting with New Technologies",
    ],
    operatingSystems: ["macos 15 Sequoia", "Bookworm"],
    toolsUsed: ["Parallels", "Termius", "Postman"],
    ides: ["Cursor", "Zed", "Android Studio", "Xcode", "neovim"],
  };