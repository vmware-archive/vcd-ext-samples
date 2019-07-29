

# Extensibility Samples for vCloud Director

## Overview
This repository contains example plugins for integrating with, and extending vCloud Director capabilities.

## Plugin Manager Utility
The plugin manager utility ([source code](../../tree/plugin-manager)) is a Python script for doing simple upload and publication of plugins from a command line.

## Custom Portal Plugin
The customize-portal plugin ([source code](../../tree/customize-portal)) is a plugin intended to work within the vCloud Director provider portal to allow customization of the provider and tenant UI portals. The current functionality includes uploading and lifecycle management of UI plugins, including portal scoping and tenant publication.

## UI Seed Plugin
The seed plugin ([source code](../../tree/plugin-seed-9.1)) is a fully functional UI plugin that can be deployed to a vCloud Director installation. It showcases the basic use cases of a UI plugin including:
* Overall project structure and required libraries
* Definition of plugin manifest (metadata for the plugin)
* Registration of a top level navigation menu
* Basic I18N
* Leveraging host-provided data
* Referencing assets embedded in the plugin

## Contributing

The vcd-ext-samples project team welcomes contributions from the community. Before you start working with vcd-ext-samples, please read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).
