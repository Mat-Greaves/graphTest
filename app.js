const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    devices: [Device!]!
  }

  type Device {
    id: ID!
    type: String!
    name: String
  }

  type Product {
    id: ID!
    name: String!
    users: [User!]!
  }

  type Query {
    user(id: ID!): User
    product(id: ID!): Product
  }
`);

class User {
  constructor(id) {
    this.id = id;
    this.name = fakeDatabase.users[id].name;
  }
  async devices() {
    console.log("fetching devices");
    return fakeDatabase.users[this.id].devices;
  }
}

class Product {
  constructor(id) {
    this.id = id;
    this.name = fakeDatabase.products[id].name;
  }
  users() {
    console.log("fetching users!");
    return fakeDatabase.products[this.id].users.map(user => {
      console.log(user);
      return new User(user.id);
    });
  }
}

const fakeDatabase = {
  products: {
    product1: {
      name: "Product 1",
      users: [
        {
          id: "matId"
        }
      ]
    }
  },
  users: {
    matId: {
      name: "Mat",
      devices: [
        {
          id: "device1",
          type: "device1 type",
          name: "device 1 name"
        },
        {
          id: "device2",
          type: "device2 type",
          name: "device 1 name"
        }
      ]
    }
  }
};
const root = {
  user: function({ id }) {
    return new User(id);
  },
  product: function({ id }) {
    return new Product(id);
  }
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(3000);

const sleep = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
