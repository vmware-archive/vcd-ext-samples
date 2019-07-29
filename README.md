

# VCD Customize Portal Plugin

## Overview
This is a plugin for configuring various parts of the vCloud Director UI portals. It currently supports managing plugins, but will soon support managing themes, and branding of the portals.

The plugin will appear as an option in the top level navigation menu of the provider portal.

## Getting Started
### Prerequisites ###
This document assumes NPM 5+ as the package manager, as well as NodeJS 8.x or 10.x. NodeJS 12.x has known incompatibilities.

An installation of vCloud Director version 9.1.0.2 or above is required to deploy the plugin.

### Build
```bash
git clone -b customize-portal --single-branch https://github.com/vmware-samples/vcd-ext-samples.git
cd vcd-ext-samples

# install project dependencies
npm ci

# build plugin
npm run build
```

### Install
> Note: A service provider admin account is necessary to install the plugin into vCloud Director.

> Note 2: If you are running version 9.7 or later of vCloud Director, you do **not** need to install this plugin, as it is installed by default in a 9.7 system.

#### Automated Deploy Method ####
A Python script is available [here](https://github.com/vmware-samples/vcd-ext-samples/tree/plugin-manager) that will automatically deploy a plugin to the associated vCD environment.  It uses various settings from the manifest.json file to define the plugin.  Usage is detailed in the [README](https://github.com/vmware-samples/vcd-ext-samples/blob/plugin-manager/README.md) for the script.

