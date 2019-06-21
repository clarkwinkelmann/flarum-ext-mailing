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
            items.add('kilowhat-mailing', Button.component({
                icon: 'fas fa-envelope',
                children: app.translator.trans('kilowhat-mailing.forum.links.mail_individual'),
                onclick() {
                    app.modal.show(new EmailUserModal({
                        user,
                    }));
                },
            }));
        }
    });

    extend(SessionDropdown.prototype, 'items', items => {
        if (app.forum.kilowhatMailingCanMailAll()) {
            items.add('kilowhat-mailing', Button.component({
                icon: 'fas fa-envelope',
                children: app.translator.trans('kilowhat-mailing.forum.links.mail_all'),
                onclick() {
                    app.modal.show(new EmailUserModal({
                        forAll: true,
                    }));
                },
            }));
        }
    });

    // Supports both fof/user-directory and the now deprecated flagrow/user-directory
    const userDirectory = flarum.extensions['fof-user-directory'] || flarum.extensions['flagrow-user-directory'];
    if (userDirectory && userDirectory.UserDirectoryPage) {
        extend(userDirectory.UserDirectoryPage.prototype, 'actionItems', items => {
            if (app.forum.kilowhatMailingCanMailAll()) {
                items.add('kilowhat-mailing', Button.component({
                    className: 'Button',
                    icon: 'fas fa-envelope',
                    children: app.translator.trans('kilowhat-mailing.forum.links.mail_all'),
                    onclick() {
                        app.modal.show(new EmailUserModal({
                            forAll: true,
                        }));
                    },
                }), 10);
            }
        });
    }
}
