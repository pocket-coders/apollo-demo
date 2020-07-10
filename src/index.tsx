import React, { Component } from "react";
import { render } from "react-dom";
import "./style.css";
import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const cache = new InMemoryCache();

const link = new HttpLink({
  uri: "https://swapi.graph.cool/",
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

// Mistake #1: I should not have to know another language to write a query
const GET_ALL_FILMS = gql`
  query GetAllFilms {
    allFilms {
      id
      title
    }
  }
`;

// Mistake #2: I should not have to repeat the description of a type
type Film = {
  // Mistake #3: The type is wrong here, and that should be caught at compile-time
  title: string;
  director: string;
};

function List() {
  const { loading, error, data } = useQuery(GET_ALL_FILMS);
  return loading ? (
    <div>loading</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <ul>
      {data.allFilms.map((film: Film) => (
        <li>
          {film.title} directed by {film.director}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <List />
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
