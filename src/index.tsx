import * as React from 'react';
import { ComponentProps } from 'react';
import { useMutation } from 'react-apollo';
import * as hoistNonReactStatics from 'hoist-non-react-statics';
import { Form } from 'vx-form';

import { useFilteredOptions, extractData, extractErrors } from './utils';

//types
import { ApolloClient, ApolloError, ErrorPolicy, MutationUpdaterFn, PureQueryOptions, WatchQueryFetchPolicy } from 'apollo-client';
import { OperationVariables, RefetchQueriesFunction } from 'react-apollo';
import { DocumentNode } from 'graphql';

type MutationFormProps<TData, TVariables> = ComponentProps<typeof Form> & {
    variables?: TVariables,
    mutation: DocumentNode,

    optimisticResponse?: TData,
    refetchQueries?: Array<string | PureQueryOptions> | RefetchQueriesFunction,
    awaitRefetchQueries?: boolean,
    errorPolicy?: ErrorPolicy,
    update?: MutationUpdaterFn<TData>,
    client?: ApolloClient<any>,
    notifyOnNetworkStatusChange?: boolean,
    context?: React.Context<any>,
    onCompleted?: (data: TData) => void,
    onError?: (error: ApolloError) => void,
    fetchPolicy?: WatchQueryFetchPolicy,
    ignoreResults?: boolean
};

const MutationForm = <TData, TVariables = OperationVariables>({
    mutation,
    variables,

    optimisticResponse,
    refetchQueries,
    awaitRefetchQueries,
    errorPolicy,
    update,
    client,
    notifyOnNetworkStatusChange,
    context,
    onCompleted,
    onError,
    fetchPolicy,
    ignoreResults,

    ...props
}: MutationFormProps<TData, TVariables>) => {
    const options = useFilteredOptions({
        optimisticResponse,
        refetchQueries,
        awaitRefetchQueries,
        errorPolicy,
        update,
        client,
        notifyOnNetworkStatusChange,
        context,
        onCompleted,
        onError,
        fetchPolicy,
        ignoreResults
    });

    const [submit] = useMutation(mutation, options);

    return (
        <Form {...props} onSubmit={(values: any) => submit({ variables: { ...variables, ...values } }).then(extractData).catch(extractErrors)} />
    );
};

export default hoistNonReactStatics(MutationForm, Form);
