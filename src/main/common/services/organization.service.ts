import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ApiPluginTenant, PluginTenantSpec, toPluginTenantSpecs} from "../../plugins/plugin.model";
import {QueryResultOrgRecordType, QueryResultRecordsType, ReferenceType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
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

    getAllTenants(): Observable<ReferenceType[]> {
        return this.client
            .query<QueryResultRecordsType>(
                Query.Builder
                .ofType("organization")
                .format("references")
                .sort({field: "name", reverse: false})
                .links(false)
                .pageSize(128)
            )
            .pipe(
                expand((pageResponse: QueryResultRecordsType) => (!this.client.hasNextPage(pageResponse)
                    ? Observable.empty()
                    : this.client.nextPage(pageResponse))),
                map((pageResponse: QueryResultRecordsType) => pageResponse["reference"] as ReferenceType[]),
                reduce((accumulator: ReferenceType[], next: ReferenceType[]) => [...accumulator, ...next]),
                take(1)
        );
    }
}
