import faker from 'faker';
import { View } from 'backbone';
import UserCollection from './collections/user';
import UserModel from './models/user';
import UserView from './views/user';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  const appNode = document.getElementById('app');

  if (appNode) {
    const UserList = new UserCollection();

    class AppView extends View {
      emptyNode: HTMLElement;

      errorNode: HTMLElement;

      listNode: HTMLElement;

      constructor(options) {
        super(options);

        const bindedSubmitForm = this.onSubmitForm.bind(this);
        document.getElementById('add-form').addEventListener('submit', bindedSubmitForm);

        this.emptyNode = document.getElementById('empty');
        this.errorNode = document.getElementById('add-error');
        this.listNode = document.getElementById('user-list');

        this.listenTo(UserList, 'reset', this.fetchAll);
        this.listenTo(UserList, 'add', this.add);
        this.listenTo(UserList, 'all', this.render);
        UserList.fetch();

        // If app is empty
        if (UserList.length === 0) {
          const createdAt = Date.now();
          const updatedAt = createdAt;
          let countByDefault = 5;

          while (countByDefault > 0) {
            const newUser = {
              createdAt,
              name: faker.name.findName(),
              phone: faker.phone.phoneNumber('+#####-###-##-##'),
              updatedAt,
            };

            const user = new UserModel(newUser);
            UserList.create(user);

            countByDefault -= 1;
          }
        }
      }

      render() {
        if (UserList.length === 0) {
          this.emptyNode.style.display = 'block';
          this.listNode.style.display = 'none';
        } else {
          this.emptyNode.style.display = 'none';
          this.listNode.style.display = 'block';
        }

        return this;
      }

      setAddError(error: Error | null) {
        let display = 'none';

        if (error instanceof Error) {
          display = 'block';
          this.errorNode.innerText = error.message;
        }

        this.errorNode.style.display = display;
      }

      add(user: UserModel) {
        const view = new UserView({
          model: user,
        });

        this.listNode.appendChild(view.render().el);
      }

      fetchAll() {
        UserList.each(this.add, this);
      }

      onSubmitForm(event) {
        this.setAddError(null);
        event.preventDefault();
        const form = event.target;

        if (form instanceof HTMLFormElement) {
          const nameInput = form['user-name'];
          const phoneInput = form['user-phone'];
          const timeNow = Date.now();

          const newUser: User = {
            createdAt: timeNow,
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            updatedAt: timeNow,
          };

          const user = new UserModel(newUser);

          if (!user.isValid()) {
            this.setAddError(user.validationError);
            return;
          }

          user.save();
          UserList.create(user);
          form.reset();
        }
      }
    }

    // eslint-disable-next-line no-new
    new AppView({
      el: appNode,
    });
  }
});
