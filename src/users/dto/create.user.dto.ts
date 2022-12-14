/**
 * CreateUserDto
 * Interface/types for creating new user from resource
 * @export
 * @interface CreateUserDto
 */
export default interface CreateUserDto {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  permissionFlag: number;
}
