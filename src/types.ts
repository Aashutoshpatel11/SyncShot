export interface UnsplashImage {
  id: string
  urls: {
    small: string
    regular: string
  }
  alt_description: string
  user: {
    name: string
  }
}
 

export interface UserProfile {
  id: string
  nickname: string
  color: string
}



export interface DBComment {
  id: string
  imageId: string
  text: string
  userName: string
  userColor: string
  createdAt: number
}

export interface DBReaction {
  id: string
  imageId: string
  emoji: string
  userName: string
  userColor: string
  createdAt: number
}


export interface AppSchema {
  comments: DBComment
  reactions: DBReaction
}