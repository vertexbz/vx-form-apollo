import * as React from 'react';
import { FORM_FEEDBACK } from 'vx-form';
import { ExecutionResult } from 'graphql';

export const useFilteredOptions = <C, K extends keyof C>(opts: C) => {
    return React.useMemo(
        () => Object.entries(opts)
            .reduce((options, [option, value]) => {
                if (value !== undefined) {
                    // @ts-ignore
                    options[option] = value;
                }

                return options;
            }, {} as C),
        Object.values(opts)
    );
};

export const extractData = (result: void | ExecutionResult<any>) => {
    if (!result) {
        return Promise.reject();
    }

    if (result.errors) {
        throw result.errors;
    }

    return result.data;
};

export const extractErrors = (error: any) => {
    const errors = [];
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        for (const e of error.graphQLErrors) {
            errors.push(e.message);
        }
    } else if (error.networkError && error.networkError.result && error.networkError.result.errors) {
        for (const e of error.networkError.result.errors) {
            errors.push(e.message);
        }
    } else {
        errors.push(error.message);
    }

    throw { error: { [FORM_FEEDBACK]: errors } };
};
