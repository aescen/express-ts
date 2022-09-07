Object.defineProperty(exports, '__esModule', { value: true });
exports.CommonRoutesConfig = void 0;
class CommonRoutesConfig {
  /**
     * Creates an instance of CommonRoutesConfig.
     * @param {express.Application} app
     * @param {string} name
     * @memberof CommonRoutesConfig
     */
  constructor(app, name) {
    this.app = app; // set routes app
    this.name = name; // set routes name
    this.configureRoutes(); // routes configurations at initialization
  }

  /**
     * Get routes name
     * @returns routes name
     * @memberof CommonRoutesConfig
     */
  getName() {
    return this.name;
  }
}
exports.CommonRoutesConfig = CommonRoutesConfig;
// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLnJvdXRlcy5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbW9uL2NvbW1vbi5yb3V0ZXMuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQXNCLGtCQUFrQjtJQUl0Qzs7Ozs7T0FLRztJQUNILFlBQVksR0FBd0IsRUFBRSxJQUFZO1FBQ2hELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsaUJBQWlCO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsa0JBQWtCO1FBQ3BDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLDBDQUEwQztJQUNwRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztDQU1GO0FBN0JELGdEQTZCQyJ9
