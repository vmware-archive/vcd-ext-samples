import {ResourceType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";

export interface Pagination<T> extends ResourceType{
    resultTotal: number;
    pageCount: number;
    page: number;
    pageSize: number;
    associations: null;
    values: T[];
}