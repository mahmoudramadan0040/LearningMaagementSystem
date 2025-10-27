import { SetMetadata } from "@nestjs/common";

export enum User_Roles {
  STUDENT = 'Student',
  TEACHING_ASSISTANT = 'Teaching_Assistant',
  DOCTOR='Doctor',
  ADMIN = "Admin",
  MANAGER='Manager',
  STUDENT_AFFAIRS_OFFICER='Student_Affairs_Officer'
}
export const ROLES_KEY = 'roles';
export const Roles = (...roles: User_Roles[]) => SetMetadata(ROLES_KEY, roles);