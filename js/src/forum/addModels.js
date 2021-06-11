import app from 'flarum/forum/app';
import Model from 'flarum/common/Model';
import Forum from 'flarum/common/models/Forum';
import Email from './models/Email';

export default function () {
    app.store.models['clarkwinkelmann-mailing-emails'] = Email;

    Forum.prototype.kilowhatMailingCanMailAll = Model.attribute('kilowhatMailingCanMailAll');
    Forum.prototype.kilowhatMailingCanMailIndividual = Model.attribute('kilowhatMailingCanMailIndividual');
}
