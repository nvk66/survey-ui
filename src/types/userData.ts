export default interface UserData {
    id?: any | null,
    login?: string | null,
    accessToken?: string | null,
    refreshToken?: string | null,
    university?: any | null,
    roles?: Array<string>
}