import { Scroll } from "./scroll.model";

/**
 * An array of data with an associated page object used for paging
 */

export interface ScrollData<T> {
    Data?: Array<T>;
    Scroll?: Scroll;
}