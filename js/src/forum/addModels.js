import Model from 'flarum/Model';
import Forum from 'flarum/models/Forum';

export default function () {
    Forum.prototype.kilowhatMailingCanMailAll = Model.attribute('kilowhatMailingCanMailAll');
    Forum.prototype.kilowhatMailingCanMailIndividual = Model.attribute('kilowhatMailingCanMailIndividual');
}
