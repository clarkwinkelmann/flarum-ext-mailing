import {extend} from 'flarum/extend';
import app from 'flarum/app';
import addModels from './addModels';
import addMailingLinks from './addMailingLinks';

app.initializers.add('kilowhat-mailing', () => {
    addModels();
    addMailingLinks();
});
