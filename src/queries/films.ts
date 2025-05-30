import { queryOptions } from "@tanstack/react-query";
import { graphql } from "~/graphql/";
import { request } from "~/graphql/request";

/**
 * Get all films
 */
export const all = () =>
  queryOptions({
    queryKey: ["films", "all"],
    queryFn: async () => {
      const query = graphql(`
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

      const result = await request(query);

      if (result.errors) {
        throw new Error(result.errors.map(error => error.message).join(", "));
      }

      return result.data?.allFilms?.films;
    }
  });

/**
 * Get a single film by id
 */
export const byId = (filmId: string) =>
  queryOptions({
    queryKey: ["films", filmId],
    queryFn: async () => {
      const query = graphql(`
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

      const result = await request(query, { id: filmId });

      if (result.errors) {
        throw new Error(result.errors.map(error => error.message).join(", "));
      }

      return result.data?.film;
    }
  });
