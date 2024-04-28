export type Session = {
  id: string;
  email: string;
  name: string;
  photoURL: string;
};

export const collectionSamples = {
  user: {
    email: 'johndoe@gmail.com',
    name: 'John Doe',
    photoURL: 'https://www.example.com/johndoe.jpg',
  },
  sport: {
    name: 'Basketball',
    players: 5,
    indoor: true,
    bestPlayer: {
      name: 'Michael Jordan',
      photoURL: 'https://www.example.com/michaeljordan.jpg',
      age: 38
    }
  }
}