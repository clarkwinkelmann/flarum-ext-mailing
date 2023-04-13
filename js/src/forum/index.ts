import app from 'flarum/forum/app';
import addMailingLinks from './addMailingLinks';

export {default as extend} from './extend';

app.initializers.add('clarkwinkelmann-mailing', () => {
    addMailingLinks();
});
