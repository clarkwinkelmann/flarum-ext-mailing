import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';

export default function () {
    extend(PermissionGrid.prototype, 'moderateItems', items => {
        items.add('kilowhat-mailing-all', {
            icon: 'fas fa-envelope',
            label: app.translator.trans('kilowhat-mailing.admin.permissions.mail_all'),
            permission: 'kilowhat-mailing.mail-all',
        });
        items.add('kilowhat-mailing-individual', {
            icon: 'fas fa-envelope',
            label: app.translator.trans('kilowhat-mailing.admin.permissions.mail_individual'),
            permission: 'kilowhat-mailing.mail-individual',
        });
    });
}
