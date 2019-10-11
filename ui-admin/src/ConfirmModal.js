//ConfirmModal.js
import React from 'react';
import { Button, Modal, ModalTitle, ModalBody, ModalFooter } from 'react-bootstrap';

export default class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: true};

        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleSubmit(event) {
        this.setState({
            modal: true
        });
    }


    render() {
        return (
            <div>
                <Button color="success" onClick={this.toggle}>Submit</Button>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalTitle>IPL 2018</ModalTitle>
                        <ModalBody>
                            <div className="row">
                                <p>Success!</p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <input type="submit" value="Submit" color="primary" className="btn btn-primary" />
                            <Button color="success" onClick={this.toggle}>OK</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>

        );
    }
}