/**
 * UpdateUserDto
 * Interface/types for updating user
 * @export
 * @interface UpdateUserDto
 */
export default interface UpdateUserDto {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  permissionFlag: number;
}
