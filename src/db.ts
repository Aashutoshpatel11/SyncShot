
import { init, i } from "@instantdb/react";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || ""; 

const schema = i.schema({
  entities: {
    comments: i.entity({
      imageId: i.string().indexed(), 
      text: i.string(),
      userName: i.string(),
      userColor: i.string(),
      createdAt: i.number().indexed(), 
    }),
    reactions: i.entity({
      imageId: i.string().indexed(), 
      emoji: i.string(),
      userName: i.string(),
      userColor: i.string(),
      createdAt: i.number().indexed(),
    }),
  },
});

export const db = init({
  appId: APP_ID,
  schema,
});

export const generateIdentity = () => {
  const adjectives = ["Neon", "Cyber", "Happy", "Swift", "Silent"];
  const animals = ["Tiger", "Eagle", "Panda", "Fox", "Wolf"];
  const colors = ["#F87171", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA"];
  
  return {
    id: crypto.randomUUID(),
    nickname: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
};