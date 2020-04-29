# Showcase Plugin

## Overview

This plugin is an example how to build extension which will bootstrap one or more actions to:

- Organization VDCs
- VMs / vApp(s)

## Build

```bash
git clone -b showcase-plugin --single-branch https://github.com/vmware-samples/vcd-ext-samples.git
cd vcd-ext-sdk

# install project dependencies
npm ci

# build plugin
npm run build
```

## Contributing

The vcd-ext-samples project team welcomes contributions from the community. Before you start working with vcd-ext-samples, please read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).