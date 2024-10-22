export interface Developer {
  name: string;
  role: string;
  company: string;
  about: string;
  code: string[];
  interests: string[];
  operatingSystems: string[];
  toolsUsed: string[];
  ides: string[];
}

export const ansxuman: Developer = {
  name: "Anshuman",
  role: "Product Engineer",
  company: "InstaSafe",
  about: "Software Developer with a keen interest in building scalable and secure applications. \nAlways eager to learn and experiment with new technologies.",
  code: ["Golang", "Svelte", "Angular", "TS", "JS", "Java", "Swift", "Rust", "Python"],
  interests: [
    "Full-Stack Development",
    "Cybersecurity",
    "DevOps",
    "Writing Blogs",
    "Experimenting with New Technologies",
  ],
  operatingSystems: ["macOS 15 Sequoia", "Debian Bookworm", "Ubuntu"],
  toolsUsed: ["Docker", "Kubernetes", "Git", "Parallels", "Termius", "Postman", "Jenkins"],
  ides: ["Cursor", "Zed", "VSCode", "Android Studio", "Xcode", "Neovim", "IntelliJ IDEA"],
};