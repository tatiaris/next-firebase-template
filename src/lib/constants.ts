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
  }
];

export enum Collections {
  User = 'user',
  Auth = 'auth'
}
