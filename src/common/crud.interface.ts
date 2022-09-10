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
  updateById: (id: string, resource: any) => Promise<any>;
  partialUpdateById: (id: string, resource: any) => Promise<any>;
  deleteById: (id: string) => Promise<any>;
}
