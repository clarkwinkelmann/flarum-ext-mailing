import app from 'flarum/app';
import Model from 'flarum/Model';
import Forum from 'flarum/models/Forum';
import Email from './models/Email';

export default function () {
    app.store.models['kilowhat-mailing-emails'] = Email;

    Forum.prototype.kilowhatMailingCanMailAll = Model.attribute('kilowhatMailingCanMailAll');
    Forum.prototype.kilowhatMailingCanMailIndividual = Model.attribute('kilowhatMailingCanMailIndividual');
}
