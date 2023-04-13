import Model from 'flarum/common/Model';

export default class Email extends Model {
    email = Model.attribute<string>('email');
}
