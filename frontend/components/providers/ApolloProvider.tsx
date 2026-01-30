"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

function makeClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      credentials: "include",
    }),
    cache: new InMemoryCache(),
  });
}

export default function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = makeClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
