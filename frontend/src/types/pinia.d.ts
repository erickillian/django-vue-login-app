import 'pinia';
import { StateTree } from 'pinia';

declare module 'pinia' {
    export interface DefineStoreOptions<
        Id extends string,
        S extends StateTree,
        G = {},
        A = {},
        P = {}
    > {
        persist?: boolean | {
            key?: string;
            paths?: (keyof S)[];
            storage?: Storage;
            serializer?: {
                serialize: (state: Partial<S>) => string;
                deserialize: (str: string) => Partial<S>;
            };
        };
    }
}
