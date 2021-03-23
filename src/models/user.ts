import { Model } from 'backbone';

const phoneReqEx = /^\+?\d+(?:-\d+)*?$/gm;
const pureString = (anyVal: any) => `${anyVal}`.trim();

class UserModel extends Model {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  validate(newUser: User) {
    const name = pureString(newUser.name);
    const phone = pureString(newUser.phone);

    if (name.length === 0) {
      return new Error('Name is required');
    }

    if (phone.length === 0) {
      return new Error('Phone number is required');
    }

    if (!phoneReqEx.test(phone)) {
      return new Error('Phone number is incorrect.Ex.: +37529-245-48-57');
    }
  }
}

export default UserModel;
