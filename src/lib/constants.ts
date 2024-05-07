export const headers = {
  POST: {
    'Content-Type': 'application/json'
  },
  PUT: {
    'Content-Type': 'application/json'
  }
};

export const navLinks = [
  {
    link: '/',
    label: 'home',
    adminOnly: false
  },
  {
    link: '/admin',
    label: 'admin',
    adminOnly: true
  }
];

export enum Collections {
  User = 'user',
  Auth = 'auth',
  Admin = 'admin'
}
