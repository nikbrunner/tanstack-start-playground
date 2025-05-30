import { graphql } from "../graphql/";

export const ALL_FILMS_QUERY = graphql(`
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
`);
