import React from "react";

import { createMedia } from "@artsy/fresnel";
import { Container, Icon, Image, Menu, Sidebar } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddMaterie from "./AddMaterie";
const AppMedia = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920,
  },
});
const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

const NavBarMobile = (props) => {
  const {
    children,
    leftItems,
    onPusherClick,
    onToggle,
    rightItems,
    visible,
    navigation,
    setShow,
  } = props;

  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        items={leftItems}
        vertical
        visible={visible}
      />
      <Sidebar.Pusher
        dimmed={visible}
        onClick={onPusherClick}
        style={{ minHeight: "100vh" }}
      >
        <Menu fixed="top" inverted>
          <Menu.Item>Maniera</Menu.Item>
          <Menu.Item onClick={onToggle}>
            <Icon name="sidebar" />
          </Menu.Item>
          <Menu.Menu position="right">
            {rightItems.map((item) => (
              <Menu.Item
                {...item}
                onClick={() => {
                  setShow(true);
                }}
              />
            ))}
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

const NavBarDesktop = (props) => {
  const { leftItems, rightItems, navigation, setShow } = props;

  return (
    <Menu fixed="top" inverted size={"huge"}>
      <Menu.Item>
        <div class="logo-holder logo-3">
          <p>Maniera</p>
        </div>
      </Menu.Item>

      {leftItems.map((item) => (
        <Menu.Item
          {...item}
          onClick={() => {
            navigation(item);
          }}
        />
      ))}

      <Menu.Menu position="right">
        {rightItems.map((item) => (
          <Menu.Item
            {...item}
            onClick={() => {
              setShow(true);
            }}
          />
        ))}
      </Menu.Menu>
    </Menu>
  );
};

const NavBarChildren = (props) => (
  <Container style={{ marginTop: "5em" }}>{props.children}</Container>
);

const NavBar = (props) => {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const handlePusher = () => {
    if (visible) setVisible(false);
  };

  const handleToggle = () => setVisible(!visible);

  const { children, leftItems, rightItems } = props;
  const navigate = useNavigate();
  const navigation = (item) => {
    navigate("/" + item.key);
  };
  return (
    <div>
      <AddMaterie setShow={setShow} show={show} />
      <Media at="mobile">
        <NavBarMobile
          leftItems={leftItems}
          onPusherClick={handlePusher}
          onToggle={handleToggle}
          rightItems={rightItems}
          visible={visible}
          navigation={navigation}
          setShow={setShow}
        >
          <NavBarChildren>{children}</NavBarChildren>
        </NavBarMobile>
      </Media>

      <Media greaterThan="mobile">
        <NavBarDesktop
          leftItems={leftItems}
          rightItems={rightItems}
          navigation={navigation}
          setShow={setShow}
        />
        <NavBarChildren>{children}</NavBarChildren>
      </Media>
    </div>
  );
};

const leftItems = [
  { as: "a", content: "Orare", key: "" },
  { as: "a", content: "Elevi", key: "elevi" },
  { as: "a", content: "Profesori", key: "Profesori" },
  { as: "a", content: "Plati", key: "plati" },
];
const rightItems = [
  { as: "a", content: "Adauga Materie Noua", key: "addmaterie" },
];
function Navbar() {
  return (
    <>
      <MediaContextProvider>
        <NavBar leftItems={leftItems} rightItems={rightItems}></NavBar>
      </MediaContextProvider>
    </>
  );
}

export default Navbar;
