import { dbStore } from '../db/store';
import { UserDoc } from '../db/types';

export class UserService {
  static async getAll(): Promise<UserDoc[]> {
    return dbStore.getAllUsers();
  }

  static async getById(userId: string): Promise<UserDoc | null> {
    return dbStore.getUserById(userId);
  }

  static async getByEmail(email: string): Promise<UserDoc | null> {
    return dbStore.getUserByEmail(email);
  }

  static async create(data: Partial<UserDoc>): Promise<UserDoc> {
    return dbStore.createUser(data);
  }

  static async update(userId: string, updates: Partial<UserDoc>): Promise<UserDoc | null> {
    return dbStore.updateUser(userId, updates);
  }

  static async delete(userId: string): Promise<boolean> {
    return dbStore.deleteUser(userId);
  }
}
