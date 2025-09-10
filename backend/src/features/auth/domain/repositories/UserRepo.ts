import {UserEntity} from "@features/auth/domain/entities/User";

export interface UserRepo {
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    create(data: Omit<UserEntity,'id'>): Promise<UserEntity>;
    updatePassword(id: string, passwordHash: string): Promise<void>;
    updateStatus(id: string, status: UserEntity['status']): Promise<void>;
}
