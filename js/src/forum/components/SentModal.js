import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import icon from 'flarum/helpers/icon';

/* global m */

export default class SentModal extends Modal {
    className() {
        return 'KilowhatMailingSentModal Modal--small';
    }

    title() {
        return app.translator.trans('kilowhat-mailing.forum.modal_sent.title_text');
    }

    content() {
        return [
            m('.MailingShipping', icon('fas fa-shipping-fast')),
            m('.Modal-body', [
                m('h1', app.translator.trans('kilowhat-mailing.forum.modal_sent.on_its_way', {
                    recipientsCount: this.props.recipientsCount,
                })),
            ]),
        ];
    }
}
