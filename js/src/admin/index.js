import app from 'flarum/app';
import addPermissions from './addPermissions';

app.initializers.add('kilowhat-mailing', () => {
    addPermissions();
});
