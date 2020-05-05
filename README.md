# VCD UI Theme Generator #
This is a utility for creating new themes (CSS files) that are compatible with the VMware CCloud Director user interfaces by leveraging the theme support built into [Clarity](https://github.com/vmware/clarity).

> **Note: This version of theme generator creates themes that are compatible with VMware Cloud Director version 10.1.**

## Overview ##
The goal of this utility is to provide an easy way for providers to brand their VCD user interface.  The most common ways to promote a visual brand are through the use of a color palette and through images/logos.  Using variables in a visual framework to define colors, and overriding those variables is a popular solution for customization in many UI libraries today, and it is a technique that the Clarity library has now adopted.

By leveraging a tool (this tool) that can process the Sass Clarity definitions alongside variable overrides and selector overrides in a specific way, providers can quickly and easily create a drop in replacement for the default vCD style sheet.

## Getting Started ##
### Install ###
```bash
git clone -b theme-generator/10.1 --single-branch https://github.com/vmware-samples/vcd-ext-samples.git theme-generator
cd theme-generator

# install project dependencies
npm ci
```

### Build Theme ###
The theme generator contains a sample base theme, which is Clarity's unmodified styles and additional VCD-specific styles. This base theme presents overridden colors for the top level navigation and side navigation, to illustrate how to specify theme colors.  To generate the CSS for it, simply run:
```bash
npm run build -- --theme=base --optimize
```

This will produce a `base.css` file in the `target/` folder.  Any number of themes can be managed as directories under the `src/` folder.  A folder with valid Sass content can be used as the `--theme` parameter value in the above build command.

This utility also contains the dark theme, which can be built and used as is, or used as the starting point for a custom theme that leans more toward the dark side:
```bash
npm run build -- --theme=dark --optimize
```

Calling the above command with no params will print usage information:

```
build-theme [options]

Generates a CSS file with specified overrides applied to base Clarity styles

Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  --theme, -t     Theme directory to generate CSS for        [string] [required]
  --optimize, -o  Whether or not to optimize and minimize the generated CSS
                                                      [boolean] [default: false]

Missing required argument: theme
```

### Theme Folder Structure ###
Each theme folder under `src` should contain the following files:
* styles.scss
* _variables.scss
* _selectors.scss

The `styles.scss` file does not need to be modified.  It ensures that the Sass pieces are built in the appropriate order to override default colors and styles with custom versions.

The `_variables.scss` is a mapping of all the variables that are overridden for a theme. 
This [Clarity Dark Theme](https://github.com/vmware/clarity/blob/v2/src/clr-angular/utils/_theme.dark.clarity.scss) file contains a farily comprehensive list of the variables that can be overridden to create a custom theme, broken down by component. Any of the variables in this file can be added to the _variables.scss file of a theme and overridden. Any variables excluded from this file retain their default value (either dark or light depending on the base theme being used).

The `_selectors.scss` file is for style overrides that can't be constrained to color variables.  The login selectors are the most commonly requested for modification.  Sass (or vanilla CSS) can be used here to achieve additional levels of branding, like changing the logo on the login page:
```css
.login-wrapper {
    display: flex;
    background: url(https://www.example.com/assets/some-cool-image.png);
    background-size: 50vw;
    background-position: right;
    background-repeat: no-repeat;
    
    .login {
        background: #1b3541;
        position: relative;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        padding: 1rem 2.5rem;
        height: auto;
        min-height: 100vh;
        width: 21rem;
        
        .title {
            color: #ffffff;
            font-weight: 200;
            font-size: 1.33333rem;
            letter-spacing: normal;
            line-height: 1.5rem;
        }
    }
}
```

## Using the Theme ##
Once you have generated a theme you need to register it with vCloud Director. To do so you: 

### Create new Theme: ### 
POST a JSON body to */cloudapi/branding/themes*

Documentation can be found: *(https://{vCD_FQDN}/docs/#api-Branding-createBrandingTheme)* 

Example body: 
```
{ 
 "name": "CloudProviders", 
 "themeType": "Custom" 
} 
```

### Create Theme Content: ### 
POST a JSON body to */cloudapi/branding/themes/<NAME>/contents* 

Documentation can be found: *(https://{vCD_FQDN}/docs/#api-Branding-uploadBrandingThemeContents)* 

Example body: 
```
{ 
 "fileName": "testtheme.css", 
 "size": 446925 
} 
```

In the return HEADER there will be a “Link” that will be used to post the CSS file. 

Example: 
*Link →<https://{vCD_FQDN}/transfer/<UUID>/testtheme.css>;rel="upload:default";type="application/octet-stream"*

### Upload Theme CSS ### 
To upload the custom CSS file: 

PUT the CSS file to the “Link” that was retrieved from the Create Theme Content step. Make sure you define Content-Type and Content-Length.  

### Verity CSS Upload ###  
To verify that you CSS was uploaded properly you can do a GET call to: */cloudapi/branding/themes/<NAME>/css*

Make sure you set your Accept header to “text/css” 

### Activate Theme ### 
Once the Theme has been uploaded it can be set as active by calling the /cloudapi/branding call and setting the theme to the <NAME>: 

To modify PUT a body of JSON to */cloudapi/branding* 

Documentation can be found: *(https://{vCD_FQDN}/docs/#api-Branding-putSystemBranding)*

Example body: 
```
{ 
    "portalName": "Cloud Provider", 
    "portalColor": "#7e1414", 
    "selectedTheme": { 
        "themeType": "Custom", 
        "name": " CloudProviders " 
    }, 
    "customLinks": [ 
        { 
            "name": "help", 
            "menuItemType": "override", 
            "url": null 
        }, 
        { 

            "name": "about", 
            "menuItemType": "override", 
            "url": null 
        }, 
        { 
            "name": "vmrc", 
            "menuItemType": "override", 
            "url": null 
        } 
    ] 
} 
```