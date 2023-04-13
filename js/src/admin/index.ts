import app from 'flarum/admin/app';

app.initializers.add('clarkwinkelmann-mailing', () => {
    app.extensionData
        .for('clarkwinkelmann-mailing')
        .registerPermission({
            icon: 'fas fa-envelope',
            label: app.translator.trans('clarkwinkelmann-mailing.admin.permissions.mail_all'),
            permission: 'kilowhat-mailing.mail-all',
        }, 'moderate')
        .registerPermission({
            icon: 'fas fa-envelope',
            label: app.translator.trans('clarkwinkelmann-mailing.admin.permissions.mail_individual'),
            permission: 'kilowhat-mailing.mail-individual',
        }, 'moderate');
});
