/**
 * Common util methods
 */
export class ObjectHelper {
    static clone(object: Object) {
        return JSON.parse(JSON.stringify(object));
    }
}
