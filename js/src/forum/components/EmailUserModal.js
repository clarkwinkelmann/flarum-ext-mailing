import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Group from 'flarum/common/models/Group';
import username from 'flarum/common/helpers/username';
import icon from 'flarum/common/helpers/icon';
import KeyboardNavigatable from 'flarum/common/utils/KeyboardNavigatable';
import SentModal from './SentModal';

/* global m */

const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

export default class EmailUserModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.sending = false;

        this.recipients = [];

        if (this.attrs.user) {
            this.recipients.push(this.attrs.user);
        }

        if (this.attrs.forAll) {
            const membersGroup = app.store.getById('groups', Group.MEMBER_ID);

            this.recipients.push(membersGroup);
        }

        this.subject = '';
        this.messageText = '';

        this.searchIndex = 0;
        this.navigator = new KeyboardNavigatable();
        this.navigator
            .when(event => {
                // Do not handle keyboard when TAB is pressed and there's nothing in field
                // Without this it's impossible to TAB out of the field
                return event.key !== 'Tab' || !!this.filter;
            })
            .onUp(() => {
                if (this.searchIndex > 0) {
                    this.searchIndex--;
                    m.redraw();
                }
            })
            .onDown(() => {
                if (this.searchIndex < this.searchResults.length - 1) {
                    this.searchIndex++;
                    m.redraw();
                }
            })
            .onSelect(() => {
                this.selectResult(this.searchResults[this.searchIndex]);
            })
            .onRemove(() => {
                this.recipients.pop();
            });

        this.filter = '';
        this.focused = false;

        this.loadingResults = false;
        this.searchResults = [];
        this.searchTimeout = null;
    }

    className() {
        return 'KilowhatMailingModal Modal--large';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-mailing.forum.modal_mail.title_text');
    }

    onready() {
        // Override the default autofocus method to focus the title field instead of the first field of the modal
        this.$('form').find('.js-focus-on-load').first().focus().select();
    }

    recipientLabel(recipient) {
        switch (recipient.data.type) {
            case 'users':
                return m('.RecipientLabel', username(recipient));
            case 'groups':
                return m('.RecipientLabel', recipient.color() ? {
                    className: 'colored',
                    style: {
                        backgroundColor: recipient.color(),
                    },
                } : {}, [
                    recipient.icon() ? [
                        icon(recipient.icon()),
                        ' ',
                    ] : null,
                    recipient.namePlural(),
                ]);
            case 'clarkwinkelmann-mailing-emails':
                return m('.RecipientLabel', recipient.email());
        }

        return '[unknown]';
    }

    searchResultKind(recipient) {
        switch (recipient.data.type) {
            case 'users':
                return app.translator.trans('clarkwinkelmann-mailing.forum.recipient_kinds.user');
            case 'groups':
                return app.translator.trans('clarkwinkelmann-mailing.forum.recipient_kinds.group');
            case 'clarkwinkelmann-mailing-emails':
                return app.translator.trans('clarkwinkelmann-mailing.forum.recipient_kinds.email');
        }

        return '[unknown]';
    }

    selectResult(result) {
        if (!result) {
            return;
        }

        this.recipients.push(result);
        this.filter = '';
        this.searchResults = [];
    }

    content() {
        return m('.Modal-body', m('form.Form', {
            onsubmit: this.onsubmit.bind(this),
        }, [
            m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-mailing.forum.modal_mail.recipients_label')),
                m('.RecipientsInput.FormControl', {
                    className: this.focused ? 'focus' : '',
                }, [
                    m('span.RecipientsInput-selected', this.recipients.map((recipient, index) => m('span.RecipientsInput-recipient', {
                        onclick: () => {
                            this.recipients.splice(index, 1);
                        },
                        title: this.searchResultKind(recipient),
                    }, this.recipientLabel(recipient)))),
                    m('input.FormControl', {
                        placeholder: app.translator.trans('clarkwinkelmann-mailing.forum.modal_mail.recipients_placeholder'),
                        value: this.filter,
                        oninput: event => {
                            this.filter = event.target.value;
                            this.performNewSearch();
                        },
                        onkeydown: this.navigator.navigate.bind(this.navigator),
                        onfocus: () => {
                            this.focused = true;
                        },
                        onblur: () => {
                            this.focused = false;
                        },
                        disabled: this.sending,
                    }),
                    this.loadingResults ? LoadingIndicator.component({
                        size: 'small',
                    }) : null,
                    this.searchResults.length ? m('ul.Dropdown-menu', this.searchResults.map(
                        (result, index) => m('li', {
                            className: this.searchIndex === index ? 'active' : '',
                            onclick: () => {
                                this.selectResult(result);
                            },
                        }, m('button[type=button]', [
                            m('span.SearchResultKind', this.searchResultKind(result)),
                            this.recipientLabel(result),
                        ]))
                    )) : null,
                ]),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-mailing.forum.modal_mail.subject_label')),
                m('input[type=text].FormControl.js-focus-on-load', {
                    value: this.subject,
                    oninput: event => {
                        this.subject = event.target.value;
                    },
                    placeholder: app.translator.trans('clarkwinkelmann-mailing.forum.modal_mail.default_subject'),
                    disabled: this.sending,
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-mailing.forum.modal_mail.message_label')),
                m('textarea.FormControl', {
                    rows: 10,
                    value: this.messageText,
                    oninput: event => {
                        this.messageText = event.target.value;
                    },
                    disabled: this.sending,
                }),
            ]),
            m('.Form-group', [
                Button.component({
                    type: 'submit',
                    className: 'Button Button--primary EditContactModal-save',
                    loading: this.sending,
                    disabled: this.recipients.length === 0 || this.messageText === '',
                }, app.translator.trans('clarkwinkelmann-mailing.forum.modal_mail.submit_button')),
            ]),
        ]));
    }

    performNewSearch() {
        this.searchIndex = 0;

        const query = this.filter.toLowerCase();

        this.buildSearchResults(query);

        clearTimeout(this.searchTimeout);
        if (query.length >= 3) {
            this.searchTimeout = setTimeout(() => {
                this.loadingResults = true;
                m.redraw();

                app.store.find('users', {
                    filter: {q: query},
                    page: {limit: 5}
                }).then(() => {
                    this.loadingResults = false;
                    this.buildSearchResults(query);
                    m.redraw();
                });
            }, 250);
        }
    }

    buildSearchResults(query) {
        if (!query) {
            this.searchResults = [];
            return;
        }

        const results = [];

        if (app.forum.kilowhatMailingCanMailAll()) {
            app.store.all('groups').forEach(group => {
                // Do not allow Guest group as it wouldn't do anything
                if (group.id() === Group.GUEST_ID) {
                    return;
                }

                if (group.nameSingular().toLowerCase().indexOf(query) !== -1 || group.namePlural().toLowerCase().indexOf(query) !== -1) {
                    results.push(group);
                }
            });
        }

        app.store.all('users').forEach(user => {
            if (user.username().toLowerCase().indexOf(query) !== -1) {
                results.push(user);
            }
        });

        if (EMAIL_REGEXP.test(this.filter)) {
            results.push(app.store.createRecord('clarkwinkelmann-mailing-emails', {
                attributes: {
                    email: this.filter,
                },
            }));
        }

        this.searchResults = results.filter(result => {
            if (result.data.type === 'clarkwinkelmann-mailing-emails') {
                return !this.recipients.some(
                    recipient => recipient.data.type === 'clarkwinkelmann-mailing-emails' && recipient.email() === result.email()
                );
            }

            return !this.recipients.some(
                recipient => recipient.data.type === result.data.type && recipient.id() === result.id()
            );
        });

        m.redraw();
    }

    onsubmit(e) {
        e.preventDefault();

        this.sending = true;

        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/admin-mail',
            body: {
                data: {
                    recipients: this.recipients.map(recipient => {
                        if (recipient.data.type === 'clarkwinkelmann-mailing-emails') {
                            return {
                                type: recipient.data.type,
                                attributes: {
                                    email: recipient.email(),
                                },
                            };
                        }

                        return {
                            type: recipient.data.type,
                            id: recipient.id(),
                        };
                    }),
                    subject: this.subject,
                    text: this.messageText,
                },
            },
        }).then(
            response => {
                this.hide();

                app.modal.show(SentModal, {
                    recipientsCount: response.recipientsCount,
                });
            },
            response => {
                this.sending = false;
                this.onerror(response);
            }
        );
    }
}
