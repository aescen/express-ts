/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * CRUD interface
 * CRUD interface
 * @export
 * @interface CRUD
 */
export default interface CRUD {
  create: (resource: any) => Promise<any>;
  list: (limit: number, page: number) => Promise<any>;
  readById: (id: string) => Promise<any>;
  readByEmail: (email: string) => Promise<any>;
  updateById: (id: string, resource: any) => Promise<string>;
  partialUpdateById: (id: string, resource: any) => Promise<string>;
  deleteById: (id: string) => Promise<string>;
}
