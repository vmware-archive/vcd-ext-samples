# Extensibility Samples for vCloud Director Built-in-FaaS Behaviors

Built-in-FaaS behaviors in vCloud Director can use a GitHub file as a source for the JavaScript file which they will execute. The example [ create-delete-org.js ]( https://www.google.com](https://github.com/kirilkadoncheva/vcd-ext-samples/blob/vcd-built-in-faas-behaviors-examples/defined-interface-behaviors/built-in-faas/create-delete-org.js ) creates an organization in VCD using the behavior invocation arguments 
and then deletes the organization after creating it. 

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
2. Execute the behavior on a defined entity

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
