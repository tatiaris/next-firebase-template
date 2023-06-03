import { createStyles } from '@mantine/core';

const BREAKPOINT = '@media (max-width: 755px)';
export const HEADER_HEIGHT = 60;

export const useStyles = createStyles((theme) => ({
  nav_linkActive: {

  },

  wrapper: {
    position: 'relative',
    marginBottom: 30
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4]
  },

  control: {
    position: 'absolute',
    width: 250,
    left: 'calc(50% - 125px)',
    bottom: -20
  },

  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`
    }
  },

  nav_inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1]
  },

  nav_links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  nav_burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  nav_dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  nav_link: {
    display: 'block',
    lineHeight: 1.5,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
    }
  },

  nav_linkLabel: {
    marginRight: 5
  },

  hp_wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
  },

  hp_inner: {
    position: 'relative',
    paddingTop: 100,
    paddingBottom: 100,

    [BREAKPOINT]: {
      paddingBottom: 80,
      paddingTop: 80
    }
  },

  hp_title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2
    }
  },

  hp_description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18
    }
  },

  hp_controls: {
    marginTop: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl
    }
  },

  hp_control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1
    }
  }
}));
