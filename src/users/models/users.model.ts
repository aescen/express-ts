import mongooseService from '../../common/services/mongoose.service';

const { Schema, model } = mongooseService.getMongoose();

const UsersSchema = new Schema(
  {
    _id: String,
    email: String,
    password: { type: String, select: false },
    firstName: String,
    lastName: String,
    permissionFlag: Number,
  },
  { id: false },
);

const UsersModel = model('Users', UsersSchema);

export default UsersModel;
