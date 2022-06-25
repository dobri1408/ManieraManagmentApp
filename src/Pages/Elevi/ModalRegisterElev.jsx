import React from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";
function ModalRegisterElev({ setShow, show }) {
  return (
    <Modal
      onClose={() => setShow(false)}
      onOpen={() => setShow(true)}
      open={show}
      trigger={<Button>Profil</Button>}
    >
      <Modal.Header>Select a Photo</Modal.Header>
      <Modal.Content image>
        <Image
          size="medium"
          src="https://react.semantic-ui.com/images/avatar/large/rachel.png"
          wrapped
        />
        <Modal.Description>
          <Header>Bucur-Sabau Maria-Mirabela</Header>
          <ul>
            <li>Data de nastere: 16.10.2003</li>
            <li>Liceu: ICHB</li>
            <li>Clasa: a XII-a</li>
            <li>Abonament: 4 sedinte</li>
            <li>Materii:</li>
          </ul>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setShow(false)}>
          Nope
        </Button>
        <Button
          content="Yep, that's me"
          labelPosition="right"
          icon="checkmark"
          onClick={() => setShow(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default ModalRegisterElev;
