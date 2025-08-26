import { SetMetadata } from "@nestjs/common";

export enum User_Roles {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ADMIN = 'Admin',
  MANAGER='Manager'
}
export const ROLES_KEY = 'roles';
export const Roles = (...roles: User_Roles[]) => SetMetadata(ROLES_KEY, roles);