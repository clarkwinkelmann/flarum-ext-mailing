import app from 'flarum/app';
import addModels from './addModels';
import addMailingLinks from './addMailingLinks';

app.initializers.add('clarkwinkelmann-mailing', () => {
    addModels();
    addMailingLinks();
});
