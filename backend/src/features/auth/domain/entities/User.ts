export type Role = 'patient' | 'doctor';
export type UserStatus = 'invited' | 'active' | 'locked';

export interface UserEntity {
    id: string;
    email: string;
    passwordHash: string;
    role: Role;
    status: UserStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
