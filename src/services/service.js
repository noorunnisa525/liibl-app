import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../constants';

export const apiHandler = createApi({
  reducerPath: 'apiHandler',
  baseQuery: fetchBaseQuery({baseUrl: baseUrl.apiUrl}),
  endpoints: builder => ({
    ParamApi: builder.mutation({
      query: ({url, method, params, token}) => {
        return {
          url: `${url}?${params}`,
          method: method,
          headers: token
            ? {
                Authorization: `Bearer ` + `${token}`,
              }
            : {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest',
              },
        };
      },
    }),
    PostApi: builder.mutation({
      query: ({url, method, data, token}) => {
        return {
          url,
          method: method,
          body: data,
          headers: token
            ? {
                Authorization: `Bearer ` + `${token}`,
              }
            : {
                Accept: 'application/json',
                'Content-Type': 'application/json', // 'Content-Type': 'multipart/form-data',
                // 'X-Requested-With': 'XMLHttpRequest',
              },
        };
      },
    }),
    GetApi: builder.query({
      query: ({url}) => ({
        url,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }),
    }),
  }),
});

export const {useGetApiQuery, usePostApiMutation, useParamApiMutation} =
  apiHandler;
