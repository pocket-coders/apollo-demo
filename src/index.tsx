import React, { Component } from "react";
import { render } from "react-dom";
import "./style.css";
import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_ALL_FILMS = gql`
  query GetAllFilms {
    allFilms {
      id
      title
    }
  }
`;

const cache = new InMemoryCache();

const link = new HttpLink({
  uri: "https://swapi.graph.cool/",
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

type Film = {
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
