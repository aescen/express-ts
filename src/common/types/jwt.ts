/**
 * Jwt
 * Interface/types for jwt refresh token
 * @type Jwt
 */
type Jwt = {
  refreshKey: string;
  userId: string;
  permissionFlag: string;
};

export default Jwt;
