import { UserModel } from './UserModel';
import {UserEntity} from "@features/auth/domain/entities/User";
import {UserRepo} from "@features/auth/domain/repositories/UserRepo";

const toEntity = (doc: any): UserEntity => ({
    id: String(doc._id),
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});

export class MongoUserRepo implements UserRepo {
    async findByEmail(email: string) {
        const doc = await UserModel.findOne({ email });
        return doc ? toEntity(doc) : null;
    }
    async findById(id: string) {
        const doc = await UserModel.findById(id);
        return doc ? toEntity(doc) : null;
    }
    async create(data: Omit<UserEntity,'id'>) {
        const doc = await UserModel.create(data);
        return toEntity(doc);
    }
    async updatePassword(id: string, passwordHash: string) {
        await UserModel.updateOne({ _id: id }, { $set: { passwordHash } });
    }
    async updateStatus(id: string, status: UserEntity['status']) {
        await UserModel.updateOne({ _id: id }, { $set: { status } });
    }
}
