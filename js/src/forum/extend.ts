import Extend from 'flarum/common/extenders';
import Forum from 'flarum/common/models/Forum';
import Email from './models/Email';

export default [
    new Extend.Store()
        .add('clarkwinkelmann-mailing-emails', Email),
    new Extend.Model(Forum)
        .attribute('kilowhatMailingCanMailAll')
        .attribute('kilowhatMailingCanMailIndividual'),
];
