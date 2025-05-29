import { gql } from "graphql-tag";

export const ALL_FILMS_QUERY = gql`
  query AllFilms {
    allFilms {
      films {
        id
        title
        releaseDate
        director
        speciesConnection {
          species {
            name
          }
        }
      }
    }
  }
`;
