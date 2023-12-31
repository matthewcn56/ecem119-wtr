export default interface IUser {
    uid: string,
    email: string,
    photoURL: string,
    displayName: string,
    waterBottles?: string[],
    familyMembers?: string[],
}