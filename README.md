

# Python Script for vCD Plugin Management

## Overview
This script provides basic plugin management capabilities for registering and unregistering plugins, and for viewing current plugin registrations.

## Prerequisites
The script requires Python 3.4+. It also requires the `requests` Python library.

## Usage
Before the script can be used a configuration file must be created to configure access to a vCloud Director instance. Copy the `manage_plugin.json.template` file to `manage_plugin.json` (in the same directory as the Python script) and modify the values as appropriate:

```json
{
  "username": "administrator",
  "org": "System",
  "password": "P@$$w0rd",
  "vcdUrlBase": "https://vmware.example.com"
}
```

The script can be executed from a command line as `python manage_plugin.py`:
```bash
usage: manage_plugin.py [-h] {register,list,unregister} ...

Manage plugins for a vCloud Director instance

positional arguments:
  {register,list,unregister}
    register            Registers a plugin
    list                Lists all registered plugins
    unregister          Removes a plugin registration

optional arguments:
  -h, --help            show this help message and exit
```
The following actions can be performed:
* register: registers and uploads a UI plugin
  * requires a plugin directory to be specified, and the plugin to already be built and available in the `dist/` folder
* unregister: removes a plugin
  * requires an id to be specified, corresponding to the id of an existing registered plugin
* list: provides a summary of currently registered plugins
  * requires no additional parameters
