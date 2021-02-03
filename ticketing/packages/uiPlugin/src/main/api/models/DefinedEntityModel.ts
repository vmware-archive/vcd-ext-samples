import {ResourceType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5/ResourceType";
import {Navigable} from "@vcd/sdk";

export interface DefinedEntity<T> extends ResourceType{
    entity: T;
    entityType: string;
    externalId: string;
    id: string;
    name: string;
    org: EntityReference;
    owner: EntityReference;
    state: string;
    navigable: Navigable;
}

export interface EntityReference {
    name: string;
    id: string;
}