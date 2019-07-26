import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ApiPluginTenant, PluginTenantSpec, toPluginTenantSpecs} from "../../plugins/plugin.model";
import {QueryResultOrgRecordType, QueryResultRecordsType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {Query} from "@vcd/sdk/query";
import {VcdApiClient} from "@vcd/sdk/client";
import {expand, map, reduce, take} from "rxjs/operators";

/**
 * Organization Service
 *  - Get Organizations
 */
@Injectable()
export class OrganizationService {
    constructor(private client: VcdApiClient) {}

    getAllTenants(): Observable<QueryResultOrgRecordType[]> {
        return this.client
            .query<QueryResultRecordsType>(
                Query.Builder
                    .ofType("organization")
                    .format("idrecords")
                    .sort({field: "name", reverse: false})
            )
            .pipe(
                expand((pageResponse: QueryResultRecordsType) => (!this.client.hasNextPage(pageResponse)
                    ? Observable.empty()
                    : this.client.nextPage(pageResponse))),
                map((pageResponse: QueryResultRecordsType) => pageResponse.record as QueryResultOrgRecordType[]),
                reduce((accumulator: QueryResultOrgRecordType[], next: QueryResultOrgRecordType[]) => [...accumulator, ...next]),
                take(1)
        );
    }
}
