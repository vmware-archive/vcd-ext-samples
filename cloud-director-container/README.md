# Cloud Director Development Environment
This project provides a standards-based local development environment for testing VCD UI plugins. It currently supports top-level navigation plugins, and works with plugins that are targeted for VCD versions 9.7.x and 10.0.x.

## Getting started
Have a system with Node.js installed on it.

Clone the project and optionally remove Git tracking:
```bash
git clone -b developer-container/9.7-10.0 --single-branch https://github.com/vmware-samples/vcd-ext-samples.git vcd-dev-env
cd vcd-dev-env
rm -rf .git
```

Install dependencies:
```bash
cd cloud-director-container/
npm ci
```

The container is now ready for use.

## Launch the container

Run `ng serve` and navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. A following section will describe how to make plugin source files also trigger an automatic reload.

## Basic Theming
Theming is currently limited to providing a custom name and logo in the application header.

Navigate to the `src/environments/environment.ts` file and modify the branding structure:
```typescript
export const environment = {
  production: false,
  branding: <Branding>{
    headerTitle: "VMware Cloud Director",
  }
};
```
The `headerTitle` can be changed, and an optional `headerLogo` can be used to provide a string path to a logo file, like `assets/logo.png`.

## Adding Plugins
Plugins are added as subdirectories of the `plugins/` folder. The process for now is to copy them by hand. In order to make plugins part of the automatic compilation and hot reload process, two separate files need to be modified. First is the `angular.json` file, where you will specify paths to the plugin modules that you want the container to manage (in the `"@angular-devkit/build-angular:browser"` builder structure):
```json
"lazyModules": [
    "src/plugins/plugin-seed/src/main/simple-plugin.module",
    "src/plugins/plugin-seed/src/main/subnav-plugin.module"
]
```
Changing this file requires a restart of the server (`ng serve`). Once the modules are added here, any changes to plugin code will automatically be rebuilt and for a reload of the container.

The second file that needs to be modified is the `src/plugins/index.ts` file. A plugin registration needs to be added to this file for each plugin that you want the container to bootstrap. The corresponding entries for the above modules would be:
```typescript
export const PLUGINS: PluginRegistration[] = [
    new PluginRegistration("src/plugins/plugin-seed/src", "main/simple-plugin.module#SimplePluginModule", "Seed Plugin"),
    new PluginRegistration("src/plugins/plugin-seed/src", "main/subnav-plugin.module#SubnavPluginModule", "Subnav Plugin")
];
```

## Leveraging an Actual VCD Instance
At some point you'll probably want to make some calls to real APIs. The next two sections address this use case.

### Proxying to VCD
The `src/proxy.conf.json` can be modified to point to a real VCD API endpoint and it will allow the container to redirect `/api` and `/cloudapi` calls to that VCD instance, and appropriately manage CORS-related issues. Changing this file requires a restart of the server (`ng serve`).

### Providing VCD Credentials to Plugins
Navigate to the `src/environments/environment.ts` file and add a credentials structure:
```typescript
export const environment = {
  production: false,
  branding: <Branding>{
    headerTitle: "VMware Cloud Director",
  },
  credentials: <UserCredentials>{
      username: "cooldude",
      tenant: "prime8",
      password: "pa$$w0rd"
  }
};
```
Then navigate to the main application module (`src\app\app.module.ts`) and uncomment the following line:
```typescript
// { provide: CONTAINER_CREDENTIALS, useValue: environment.credentials },
```
in the NgModule declaration. The bootstrapping process will now establish a session with the specified credentials and provide that valid session to plugins.

As an alternative to logging in and creating a new session every time the application refreshes, you can provide a `TokenCredentials` object instead of the `UsersCredentials` object:
```typescript
credentials: <TokenCredentials>{
    token: `
     Bearer eyJhbGciOidfkgjhsdfgkjhdsfgkjhdfgkjhdfjghdsfgkjhsdfgkjhdfgkjhfQ.FOaH_epodsfgnbhidbgfs,dfhgksdhfbgosdnfbglsdfhgb,sdkfjyghb,sdmfnhglsdnmfbgosdhgfbglkdsfghb,dmnfbgm,sdf bgouya,dsnfgashgdaksydgfvahsgdfyiuastdgfrnVnu1WrWUB7pfew
    `
  }
```
Where `token` is the JWT token of an active session that can be reused.
