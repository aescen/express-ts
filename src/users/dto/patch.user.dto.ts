import UpdateUserDto from './update.user.dto';

/**
 * PatchUserDto
 * Interface/types for updating user partially
 * @export
 * @interface PatchUserDto
 * @extends {Partial<UpdateUserDto>}
 */
export default interface PatchUserDto extends Partial<UpdateUserDto> {}
