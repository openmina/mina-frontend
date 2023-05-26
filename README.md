# Open Mina Explorer

This project was created to help developers to trace and debug the Mina blockchain. It is a web application written in Angular 15 that uses one or more Mina nodes as backends.

The application is available at [https://metrics.openmina.com](https://metrics.openmina.com)

# Table of Contents
1. [How to run it on your machine](#how-to-run-it-on-your-machine)
2. [How to use the application](#how-to-use-the-application)
3. [Available features (pages)](#available-features-pages)
4. [Architecture](#architecture)
5. [Configuring your own setup of nodes](#configuring-your-own-setup-of-nodes)
6. [Running Tests](#running-tests)
7. [Web node integration steps](#web-node-integration-steps)

## How to run it on your machine

1. **Install Node.js:** First, you need to install Node.js on your computer. You can download the installer from the Node.js website at https://nodejs.org/en/download/. Make sure you install the latest version of Node.js that is compatible with your operating system.

2. **Install Angular CLI:** Once you have Node.js installed, open a command prompt or terminal window and run the following command to install the Angular CLI:
`npm install -g @angular/cli@15.0.0`.
This command will install the version 15 of the Angular CLI globally on your computer.

3. **Clone the project:** Next, clone the Angular project from the Git repository or download the source code as a ZIP file and extract it to a local directory on your computer.

4. **Install project dependencies:** Open a command prompt or terminal window in the project directory and run the following command to install the project dependencies:
`npm install`.
   This command will install all the required dependencies for the project based on the package.json file.
5. **Serve the project:** Finally, run the following command to serve the project:
`ng serve`
   This command will start a development server and open the project in your default web browser. You can access the project at http://localhost:4200/.

## How to use the application

The application is divided into three main sections:
- The toolbar
- The menu sidebar
- The main view

1. **The toolbar** is located at the top of the application. It contains the following parts:
   - **Active page:** This tells you which page you are currently viewing.
   - **Possible subpages:** These tabs allow you to switch between the different subpages of the current page.
   - **Status section:** This section displays the status of the active node and its block level.
   - **Node Switcher:** This dropdown button allows you to connect to different nodes that are provided in the application's configuration.
   - **Loading bar:** This bar indicates there is a http request in progress in the background.

2. **The menu sidebar** is located on the left side of the application. It contains the menu items that allow you to navigate between the different pages of the application. On the top of it you can find a button for collapsing the side menu and on the bottom the theme switcher that allows you to switch between the light and dark theme.
3. **The main view** is the main part of the application. It contains the content of the currently active page.

## Available features (pages)

1. [Dashboard](https://github.com/openmina/mina-frontend/blob/main/docs/MetricsTracing.md#Dashboard) - This page shows a summary of the current status of each node connected to the application.
2. [Explorer](https://github.com/openmina/mina-frontend/blob/main/docs/MetricsTracing.md#Explorer) - The Explorer page enables you to access blockchain data recorded in the form of blocks, transaction pool, snark pool, scan state and snark traces.
3. [Resources](https://github.com/openmina/mina-frontend/blob/main/docs/MetricsTracing.md#Resources) - The Resources page allows you to view how much resources are being used over time by the currently active node.
4. [Network](https://github.com/openmina/mina-frontend/blob/main/docs/MetricsTracing.md#Network) - The Network page allows you to view the network communication of the currently active node.
5. [Tracing](https://github.com/openmina/mina-frontend/blob/main/docs/MetricsTracing.md#Tracing) - The Tracing page allows you to follow the traces of each block of the currently active node.
6. [Benchmarks](https://github.com/openmina/mina-frontend/blob/main/docs/MetricsTracing.md#Benchmarks) - The Benchmarks page allows you to send transactions within currently active node in order to track its behaviour and spot potential issues.

## Architecture

1. **Data flow:**
   - We believe that the best way to control the complexity of an application is to have a single source of truth. This is why the application uses the Redux pattern to control the data flow. This pattern is implemented using the [NgRx](https://ngrx.io/) library in combination with the [RxJS](https://rxjs.dev/) library together with the Observables pattern. The application uses the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) for easier debugging while developing.
   - Overall, the data flow process in the application that uses NgRx follows a predictable pattern of **fetching data**, triggering an **Effect** to dispatch an **action**, updating the application **state** with a **Reducer**, emitting the updated state through a **Selector**, and **subscribing** to the emitted **Observable** in one or more **components**. This pattern provides a powerful and flexible way of managing complex application state and data flows.

2. **Layout:**
   - To arrange and distribute items within the DOM, the application is using a flexible box layout model.
   - A few Angular Material components such as _mat-sidenav-container_ are also used to create the layout of the application.

3. **Styling:**
   - The application uses **SCSS** as a preprocessor for CSS. The SCSS files are compiled into CSS files using the [Sass](https://sass-lang.com/) compiler. There are many helper classes that are used to style the components. We are taking the approach of creating our own helper classes instead of using a CSS framework like Bootstrap. This allows us to have a more flexible and customizable styling. The application uses the [Angular Material](https://material.angular.io/) library for some components, although we are applying our own styling to them.
   - The application is already designed to support **multiple themes**. So far, we have implemented the **light** and **dark** theme but the theme switcher can be easily extended to support more themes. The theme switcher uses a replacement mechanism to replace the CSS files of the application with the ones of the selected theme. This allows us to have a lazy loaded theme switcher without the need to reload the application. The theme switcher is located in the _src/app/core/services/theme-switcher.service.ts_ and the button for switching the theme is located in the bottom of the side menu.

4. **Error handling**:
   - As we don't live in a perfect world, there are situations when things can go wrong. The application is designed to handle errors in a graceful way. To catch errors, the application uses 2 mechanisms.
   - The first mechanism is that the application relies on the **RxJS** _catchError_ to capture the errors that occur inside an **observable**.
   - The second mechanism is extending the [ErrorHandler](https://angular.io/api/core/ErrorHandler) provided by Angular which is injected at the **initialization** of the application. This mechanism is used to catch all uncaught errors that occur within the application. For example, when a component is initialized and an error occurs, the _GlobalErrorHandler_ will catch it and ensure it is handled.
   - All errors that are captured, are dispatched to the _src/app/core/store/reducers/error.reducer.ts_ where they are handled and displayed to the user using a notification.

5. **Project structure:** The application is structured in a way that allows us to easily add new features and pages. The application is divided into 4 main modules:
   - **Core:** This directory contains the core functionality of the application.
     - **services** that are used to do actions which affect the application globally
     - **interceptors** that are used to intercept http requests and responses
     - **guards** that are used to protect routes
     - **global error handler** that is used to catch uncaught errors
     - **theme switcher** that is used to switch between the themes
   - **Layout:** This directory contains components of the application that are eagerly loaded and are used in every page of the application. These components are:
     - **error-preview** that is used to display the error messages
     - **side-menu** that is used to display the menu items
     - **node-picker** that is used to display the node switcher
     - **server-status** that is used to display the status of the active node
     - **submenu-tabs** that is used to display the possible subpages of a page
     - **toolbar** acts as a container for the toolbar items
   - **Features:**
     - This directory contains _the features_ of the application. Each feature is a module that contains the components, services, pipes, directives, effects, etc. that are used by the feature.
     - Each feature module is lazy loaded when the user navigates to the feature page which allows us to reduce the initial load time of the application. Each feature can have its own subpages which are also lazy loaded.
     - We are using NgRx **combined reducers** and **forFeature** method to compose the reducers and effects of the feature. This allows us to have a modular approach to the application and to easily add new features (even inside a parent feature).
   - **Shared:** This directory contains components, services, pipes, directives, etc. that are used by multiple features of the application. The shared module is imported by the feature modules that need it. Its purpose is to reduce the size of the feature modules and to avoid code duplication. The shared module is also lazy loaded when the user navigates to the feature page that requires it which allows us to reduce the initial load time of the application. The shared directory is structured in the following way:
     - **base classes:** This directory contains base classes that are used by multiple classes of the application. 
     - **components:** This directory contains components that rely on **@Input()** values and are used by multiple features of the application.
     - **constants:** This directory contains global constants variables to remove code duplication.
     - **directives:** This directory contains directives that are used by multiple components within the application.
     - **enums:** This directory contains enum types that are used in multiple places within the application.
     - **helpers:** This directory contains global helper functions that are used across the application.
     - **pipes:** This directory contains pipes that are used by multiple features of the application.
     - **router:** This directory contains router-related classes that ensure the router information is available in the NgRx store. 
     - **services:** This directory contains services that are used by multiple features of the application.
     - **types:** This directory contains Typescript types that are used in multiple places within the application.
     
## Configuring your own setup of nodes
 You can add your own configuration of nodes to track their status. To do so, you need to add the correct **Typescript** structure in the _src/environments/environment.ts_ file. The structure of the configuration is a **Readonly<MinaEnv>** _src/app/shared/types/mina-env.type.ts_ .
Here is an example of a configuration that contains 2 nodes:
```typescript
import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  isVanilla: false,
  identifier: 'My Config',
  configs: [
    {
      backend: 'https://trace.dev.openmina.com:3086',
      debugger: 'https://trace.dev.openmina.com:3087', 
      minaExplorer: 'https://devnet.api.minaexplorer.com',
      features: {
        dashboard: ['nodes'],
        explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
        resources: ['system'],
        network: ['messages', 'connections', 'blocks', 'blocks-ipc'],
        tracing: ['overview', 'blocks'],
        benchmarks: ['wallets'],
        'web-node': ['wallet', 'peers', 'logs', 'state'],
      },
      name: 'Awesome Node 1 😎',
    },
    {
      backend: 'https://sandbox.dev.openmina.com:3086',
      minaExplorer: 'https://devnet.api.minaexplorer.com',
      features: {
        dashboard: ['nodes'],
        explorer: ['blocks', 'snark-pool'],
        resources: ['system'],
        network: ['messages', 'blocks'],
        tracing: ['blocks'],
        benchmarks: ['wallets'],
      },
      name: 'Awesome Node 2 😎',
    },
  ],
};
```

As you can see, the features object is used to enable/disable the features of the application. Each feature is optional and if it is not present, it will be non-accessible.
Each feature can contain an array of sub-features (sub-pages) that are also customizable.
The features and sub-features that are available are:
- **dashboard**
  - **nodes**
- **explorer**
  - **blocks**
  - **transactions**
  - **snark-pool**
  - **scan-state**
  - **snark-traces**
- **resources**
  - **system**
- **network**
  - **messages**
  - **connections**
  - **blocks**
  - **blocks-ipc**
- **tracing**
  - **overview**
  - **blocks**
- **benchmarks**
  - **wallets**
- **web-node**
  - **wallet**
  - **peers**
  - **logs**
  - **state**

Beside a node-specific configuration, you can also add a global configuration that will be used by all the nodes who don't contain a specific feature configuration.
The global configuration is optional and if it is not present, the default values will be used.
> Please note that the global configuration is not merged with the node-specific configuration. If a node-specific configuration is present, it will override the global configuration entirely.

Here is a setup that exemplifies the global configuration with all currently available features:
```typescript
import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  isVanilla: false,
  identifier: 'My Config',
  globalConfig: {
    features: {
      dashboard: ['nodes'],
      explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
      resources: ['system'],
      network: ['messages', 'connections', 'blocks', 'blocks-ipc'],
      tracing: ['overview', 'blocks'],
      benchmarks: ['wallets'],
      'web-node': ['wallet', 'peers', 'logs', 'state'],
    },
  },
  configs: [
    {
      backend: 'https://trace.dev.openmina.com:3086',
      debugger: 'https://trace.dev.openmina.com:3087',
      minaExplorer: 'https://devnet.api.minaexplorer.com',
      name: 'Awesome Node 1 😎',
    },
    {
      backend: 'https://sandbox.dev.openmina.com:3086',
      minaExplorer: 'https://devnet.api.minaexplorer.com',
      name: 'Awesome Node 2 😎',
    },
  ],
};
```

The following properties of the `MinaEnv` configuration are optional:
`isVanilla`, `identifier`, `globalConfig`, `globalConfig.features`, `configs.debugger`, `configs.minaExplorer`, `configs.features`

## Running tests
The application is tested using the Cypress framework. The tests are located in the _cypress/e2e_ directory. To run the tests, you need to run the following command:
```bash
npm run tests:headless
```
The tests are run in headless mode. To run the tests in the browser, you need to run the following command:
```bash
npm run tests
```
