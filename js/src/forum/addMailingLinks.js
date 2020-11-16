import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import UserControls from 'flarum/utils/UserControls';
import SessionDropdown from 'flarum/components/SessionDropdown';
import EmailUserModal from './components/EmailUserModal';

/* global flarum */

export default function () {
    extend(UserControls, 'moderationControls', (items, user) => {
        if (app.forum.kilowhatMailingCanMailIndividual()) {
            items.add('clarkwinkelmann-mailing', Button.component({
                icon: 'fas fa-envelope',
                onclick() {
                    app.modal.show(EmailUserModal, {
                        user,
                    });
                },
            }, app.translator.trans('clarkwinkelmann-mailing.forum.links.mail_individual')));
        }
    });

    extend(SessionDropdown.prototype, 'items', items => {
        if (app.forum.kilowhatMailingCanMailAll()) {
            items.add('clarkwinkelmann-mailing', Button.component({
                icon: 'fas fa-envelope',
                onclick() {
                    app.modal.show(EmailUserModal, {
                        forAll: true,
                    });
                },
            }, app.translator.trans('clarkwinkelmann-mailing.forum.links.mail_all')));
        }
    });

    const userDirectory = flarum.extensions['fof-user-directory'];
    if (userDirectory && userDirectory.UserDirectoryPage) {
        extend(userDirectory.UserDirectoryPage.prototype, 'actionItems', items => {
            if (app.forum.kilowhatMailingCanMailAll()) {
                items.add('clarkwinkelmann-mailing', Button.component({
                    className: 'Button',
                    icon: 'fas fa-envelope',
                    onclick() {
                        app.modal.show(EmailUserModal, {
                            forAll: true,
                        });
                    },
                }, app.translator.trans('clarkwinkelmann-mailing.forum.links.mail_all')), 10);
            }
        });
    }
}
