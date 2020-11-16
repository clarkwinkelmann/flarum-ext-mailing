import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('clarkwinkelmann-mailing', () => {
    extend(PermissionGrid.prototype, 'moderateItems', items => {
        items.add('clarkwinkelmann-mailing-all', {
            icon: 'fas fa-envelope',
            label: app.translator.trans('clarkwinkelmann-mailing.admin.permissions.mail_all'),
            permission: 'kilowhat-mailing.mail-all',
        });
        items.add('clarkwinkelmann-mailing-individual', {
            icon: 'fas fa-envelope',
            label: app.translator.trans('clarkwinkelmann-mailing.admin.permissions.mail_individual'),
            permission: 'kilowhat-mailing.mail-individual',
        });
    });
});
