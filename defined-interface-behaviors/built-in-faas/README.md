# Extensibility Samples for vCloud Director Built-in-FaaS Behaviors

Built-in-FaaS behaviors in vCloud Director can use a GitHub file as a source for the JavaScript file which they will execute. The example [ create-delete-org.js ]( https://www.google.com](./create-delete-org.js ) creates an organization in VCD using the behavior invocation arguments 
and then deletes the organization after creating it. 

## Prerequisities

In vCloud Director behaviors only exist in the context of interfaces. The idea is that behaviors are created "inside" interfaces. Behaviors are "actions" which can be executed on defined entities. Defined entities are instances of defined entity types. Defined entity types define the schema of the information that you can store by using defined entities. More resources on defined entities:

[ Managing Defined Entities ]( https://docs.vmware.com/en/VMware-Cloud-Director/10.3/VMware-Cloud-Director-Service-Provider-Admin-Portal-Guide/GUID-0749DEA0-08A2-4F32-BDD7-D16869578F96.html )

[ VMware Cloud Director OpenAPI Specification ]( https://developer.vmware.com/apis/vmware-cloud-director/latest/ )

[ SDK Defined Entities Getting Started ]( https://vmware.github.io/vcd-ext-sdk//docs/defined_entities/getting_started )

In order to create and execute a built-in-FaaS behavior you need to have an interface, a defined entity type implementing the given interface and a defined entity of the same type to execute the behavior on. 
1. Create interface

```
POST https://<vcd-host>/cloudapi/1.0.0/interfaces

{
    "name": "test_interface",
    "version": "1.0.0",
    "vendor": "vmware",
    "nss": "test_interface",
    "readonly": false
}
```
Id of newly created interface is returned as part of the response.

2. Add behaviors to interface (See next section)

3. Create defined entity type implementing the interface
```
POST https://<vcd-host>/cloudapi/1.0.0/entityTypes

{
   "vendor":"vmware",
   "name":"test type",
   "nss":"test_type_2",
   "version":"1.0.0"
   "description": "string",
   "externalId": "123",
   "hooks": {}
   "inheritedVersion": "1.0.0",
   "interfaces": [
	   <interface-id-1>, <interface-id-2>, ...
   ],
   "readonly": false,
   "schema":{
      ...
   }
}
```
Id of newly created defined entity type is returned as part of the response.

4. Add behavior access controls to defined entity type (behavior access controls define what minimum level of access must the user invoking the behavior have on the defined entity. Access level possible values are urn:vcloud:accessLevel:ReadOnly, urn:vcloud:accessLevel:ReadWrite, urn:vcloud:accessLevel:FullControl)

```
POST https://<vcd-host>/cloudapi/1.0.0/entityTypes/<entity-type-id>/behaviorAccessControls

{
	"accessLevelId": "urn:vcloud:accessLevel:ReadOnly",
	"behaviorId": "<behavior-id>"
}
```
5. Create defined entity

```
POST https://<vcd-host>/cloudapi/1.0.0/entityTypes/{id}

{
   "name":"test-entity",
   "entity":{
      ...
   }
}
```
Response contains a task in the location header. 

6. Get task to obtain newly created defined entity id

```
GET <location-header-link>
```
The defined entity id is part of the rsponse under owner -> id.

7. Resolve newly created defined entity

```
POST https://<vcd-host>/cloudapi/1.0.0/entities/<entity-id>/resolve
```

## Steps to create and invoke Built-In-FaaS behavior executing the code in create-delete-org.js

1. Create a Built-in-FaaS behavior in an already created interface

```
POST https://<vcd-host>/cloudapi/1.0.0/interfaces/<interface-id>/behaviors

{
    "name": "testBehaviorGitHub",
    "execution": {
        "type": "InternalJSFaaS",
        "id": "testBehavior",
        "execution_properties" : {
            "source": {
                "github-source": <permalink to file create-delete-org.js file>
            }
           }
        }
  }
```
Id of newly created behavior is returned as part of the response.

2. Invoke the behavior on a defined entity

```
POST https://<vcd-host>/cloudapi/1.0.0/entities/<entity-id>/behaviors/<behavior-id>/invocations

{
    "arguments": {
            "orgName": "TestOrg",
            "orgDisplayName": "Test organization",
            "orgDescription": "Test organization description",
            "orgIsEnabled": false,
            "orgCanPublish": false
    }
}
```

Executing the behavior should create an organization with name "orgName" and display name "orgDisplayName" and then delete it.
