import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Email extends mixin(Model, {
    email: Model.attribute('email'),
}) {
}
