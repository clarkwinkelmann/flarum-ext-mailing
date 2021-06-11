import app from 'flarum/forum/app';
import addModels from './addModels';
import addMailingLinks from './addMailingLinks';

app.initializers.add('clarkwinkelmann-mailing', () => {
    addModels();
    addMailingLinks();
});
