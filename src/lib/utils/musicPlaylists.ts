import type { Song } from '../types/music';

export const ALL_MUSIC: Song[] = [
  {
    name: "Hearty",
    artist: "Aventure",
    img: "hearty.png",
    src: "hearty.mp3",
    genre: "Calm",
  },{
    name: "Prism",
    artist: "Theatre Of Delays",
    img: "prism.png",
    src: "prism.mp3",
    genre: "Ambient",
  },{
    name: "Soft Vibes",
    artist: "Vitale",
    img: "softvibes.png",
    src: "softvibes.mp3",
    genre: "Hip-Hop / R&B",
  },{
    name: "Moon Light Drive",
    artist: "Yunior Arronte",
    img: "moonlightdrive.png",
    src: "moonlightdrive.mp3",
    genre: "Calm",
  },{
    name: "Slow Life",
    artist: "Benjamin Lazzarus",
    img: "slowlife.png",
    src: "slowlife.mp3",
    genre: "Cinematic",
  },
  {
    name: "Dawn of Change",
    artist: "Roman Senyk",
    img: "dawnofchange.png",
    src: "dawnofchange.mp3",
    genre: "Cinematic",
  },
  {
    name: "Hope",
    artist: "Hugo Dujardin",
    img: "hope.png",
    src: "hope.mp3",
    genre: "Cinematic",
  },{
    name: "Echo of Sadness",
    artist: "TURNIQUE",
    img: "echoofsadness.png",
    src: "echoofsadness.mp3",
    genre: "Cinematic",
  },
  {
    name: "Prism",
    artist: "Theatre Of Delays",
    img: "prism.png",
    src: "prism.mp3",
    genre: "Cinematic",
  },
  {
    name: "Sleepless",
    artist: "Diffie Bosman",
    img: "sleepless.png",
    src: "sleepless.mp3",
    genre: "Cinematic",
  },
  {
    name: "The Inside",
    artist: "Benjamin Lazzarus",
    img: "theinside.png",
    src: "theinside.mp3",
    genre: "Cinematic",
  },
  {
    name: "Kammo Ji",
    artist: "Talwiinder",
    img: "kammoji.png",
    src: "kammoji.mp3",
    genre: "Talwiinder",
  }
  // ,{
  //   name: "Talwiinder. NDS - KHOYA",
  //   artist: "Talwiinder",
  //   img: "khoya.png",
  //   src: "khoya.mp3",
  //   genre: "Talwiinder",
  // },{
  //   name: "TU - Talwiinder (prod. Sanjoy)",
  //   artist: "Talwiinder",
  //   img: "tu.png",
  //   src: "tu.mp3",
  //   genre: "Talwiinder",
  // }
];

export const INITIAL_VOLUME = 70;
export const PROGRESS_UPDATE_DURATION = 200;