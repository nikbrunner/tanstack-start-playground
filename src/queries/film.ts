import { graphql } from "../graphql/";

export const FILM_QUERY = graphql(`
  query Film($id: ID) {
    film(id: $id) {
      title
      director
      producers
      releaseDate
      openingCrawl
    }
  }
`);
