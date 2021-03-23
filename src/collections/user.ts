import { Collection } from 'backbone';
import { LocalStorage } from 'backbone.localstorage';
import UserModel from '../models/user';

class UserCollection extends Collection {
  model = UserModel;

  localStorage = new LocalStorage('UserCollection');
}

export default UserCollection;
