import React from 'react';
import Link from 'next/link';
import { logout } from '@/components/helper';
import { config } from '@/components/config';
import { IconChevronDown, IconHome2, IconTool } from '@tabler/icons-react';
import { useState } from 'react';
import { Paper, Menu, Center, Header, Container, Group, Button, Burger, Avatar, Text, UnstyledButton, Transition, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useStyles, HEADER_HEIGHT } from '@/styles/custom';

/**
 * Navbar component
 */

const links = [
  {
    link: '/',
    label: 'Home',
    icon: <IconHome2 size={12} stroke={2} />,
    links: null
  },
  {
    link: '/testing',
    label: 'Testing',
    icon: <IconTool size={12} stroke={2} />,
    links: null
  }
];

interface NavbarProps {
  session: any;
  setSession: any;
}
export const Navbar: React.FC<NavbarProps> = ({ session, setSession }): React.ReactElement => {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { toggleColorScheme } = useMantineColorScheme();

  const [logoutFailed, setLogoutFailed] = useState(false);
  const handleLogout = async () => {
    const data = await logout();
    if (!data.success) setLogoutFailed(true);
    else setSession(null);
  };

  const burgerItems = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Link key={item.label} href={item.link}
        className={cx(classes.nav_link, { [classes.nav_linkActive]: active === item.link })}
        onClick={(event) => {
          setActive(item.link);
          close();
        }}>
        {item.icon} {item.label}
      </Link>
    ));
    if (menuItems) {
      return (
        <>
          <Text size="sm" color="blue" style={{ marginLeft: '5px' }}>
            {link.label}
          </Text>
          {menuItems}
        </>
      );
    }
    return (
      <Link key={link.label} href={link.link}
        className={cx(classes.nav_link, { [classes.nav_linkActive]: active === link.link })}
        onClick={(event) => {
          setActive(link.link);
          close();
        }}>
        {link.icon} {link.label}
      </Link>
    );
  });

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item
        onClick={() => {
          window.location = item.link;
        }}
        key={item.link}>
        {item.icon} {item.label}
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover">
          <Menu.Target>
            <span className={classes.nav_link}>
              <Center>
                <span className={classes.nav_linkLabel}>{link.label}</span>
                <IconChevronDown size={12} stroke={1.5} />
              </Center>
            </span>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link key={link.label} href={link.link} className={classes.nav_link}>{link.label}</Link>
    );
  });

  return (
    <Header height={HEADER_HEIGHT}>
      <Container className={classes.nav_inner} fluid>
        <Group style={{ width: '100%' }}>
          <Burger opened={opened} onClick={toggle} className={classes.nav_burger} size="sm" />
          <Transition transition="scale-y" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.nav_dropdown} withBorder style={{ ...styles, zIndex: 5 }}>
                {session && burgerItems}
              </Paper>
            )}
          </Transition>
          <Avatar src={`/logo.svg`} size="md" />
        </Group>
        <Group style={{ width: '100%', justifyContent: 'center' }} spacing={5} className={classes.nav_links}>
          {items}
        </Group>
        <Group style={{ width: '100%', justifyContent: 'flex-end' }}>
          {!session ? (
            <Link href="/login" passHref>
              <Button>Login / Signup</Button>
            </Link>
          ) : (
            <Menu position="bottom-end" offset={-4} width="target" withArrow arrowSize={15} arrowOffset={25}>
              <Menu.Target>
                <UnstyledButton
                  sx={(theme) => ({
                    display: 'block',
                    padding: '9px 15px',
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                    '&:hover': {
                      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
                    }
                  })}>
                  <Group>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <Text size="sm" weight={500}>
                        {session.displayName}
                      </Text>
                      <Text color="dimmed" size="xs">
                        {session.email}
                      </Text>
                    </div>
                    <Avatar src={session.photoURL} size="md" radius="xl" />
                    {<IconChevronDown size={16} />}
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => toggleColorScheme} color="blue">
                  Toggle Theme
                </Menu.Item>
                <Menu.Item onClick={handleLogout} color="red">
                  Log Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>
    </Header>
  );
};

export default Navbar;
