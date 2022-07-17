export declare interface AuthUser {
  srl: number
  email: string
  name: string
  admin: boolean
}
export declare interface Auth {
  token: string
  user?: AuthUser
}
