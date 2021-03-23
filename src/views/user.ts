import { View } from 'backbone';
import { template } from 'underscore';

class UserView extends View {
  editMode = false;

  editTemplate = template(document.getElementById('user-edit-template').innerHTML);

  template = template(document.getElementById('user-template').innerHTML);

  constructor(options) {
    super(options);
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  }

  render() {
    const { model } = this;
    const needTemplate = this.editMode ? this.editTemplate : this.template;
    this.el.innerHTML = needTemplate(model.toJSON());

    const buttons = this.el.getElementsByTagName('button');
    const cancelRemoveButton = buttons[1];

    if (this.editMode) {
      const form = this.el.getElementsByTagName('form')[0] as HTMLFormElement;

      const nameInput = form['user-name'];
      nameInput.focus();

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const phoneInput = form['user-phone'];

        const newUser = {
          name: nameInput.value.trim(),
          phone: phoneInput.value.trim(),
          updatedAt: Date.now(),
        };

        model.set(newUser);

        if (!model.isValid()) {
          alert(model.validationError);
          return;
        }

        model.save();
        this.toggleEditMode();
      });

      cancelRemoveButton.addEventListener('click', () => {
        model.set(model.previousAttributes());
        this.toggleEditMode();
      });
    } else {
      buttons[0].addEventListener('click', () => {
        this.toggleEditMode();
      });

      cancelRemoveButton.addEventListener('click', () => {
        model.destroy();
      });
    }

    return this;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.render();
  }
}

export default UserView;
