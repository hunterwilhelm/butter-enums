/**
 * A type that represents an error message for ButterEnums.
 *
 * @template T - The type of the error message.
 *
 * @returns {ButterEnumsErrorMessage<T>} An object with an error message and a value of type never.
 */
export type ButterEnumsErrorMessage<T> = {
    __error__: T;
    value: never;
};
export declare function makeButterEnumsErrorMessage<T>(message: T): ButterEnumsErrorMessage<T>;
