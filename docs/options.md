# Configuration

The rig uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find and load a configuration file. Starting from the current working directory, it looks for the following possible sources:

- a `prototype` property in `package.json`
- a `.prototyperc` file
- a `prototype.config.js` file exporting a JavaScript object
- a `prototype.config.cjs` file exporting a JavaScript object (if you have `"type": "module"` set in `package.json`)

The search stops when one of these is found. You can use the `--config` CLI option to short-circuit this search.

The `.prototyperc` file (without extension) can be in JSON or YAML format. Add a filename extension to help your text editor provide syntax checking and highlighting:

- `.prototyperc.json`
- `.prototyperc.yaml` / `.prototyperc.yml`
- `.prototyperc.js`

## Options

The following options can be set in your configuration file:

| Name                       | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **serviceName**            | string  | The name of your service. Default is `'Your service name'`.                                                                                                                                                                                                                                                                                                                                                                                 |
| **showLogs**               | boolean | Logs session data in the browser console. Default is `false`.                                                                                                                                                                                                                                                                                                                                                                               |
| **templateExtension**      | string  | The file extension used for your templates. Default is `'html'`.                                                                                                                                                                                                                                                                                                                                                                            |
| **useAuth**                | boolean | Enable or disable password protection on production. Default is `true`.                                                                                                                                                                                                                                                                                                                                                                     |
| **useAutoStoreData**       | boolean | Automatically store form data and send to all views. Default is `true`.                                                                                                                                                                                                                                                                                                                                                                     |
| **useCookieSessionStore**  | boolean | Enable cookie-based session store (persists on restart). Please note 4KB cookie limit per domain, cookies too large will silently be ignored. Default is `false`.                                                                                                                                                                                                                                                                           |
| **useHttps**               | boolean | Force HTTP to redirect to HTTPS on production. Default is `true`.                                                                                                                                                                                                                                                                                                                                                                           |
| **defaultRigLayout**       | string  | Use a layout from your prototype for the views provided by the rig. So, for example the ‘Clear session data’ and password pages can use a layout that matches the rest of your prototype. If no option is given rig pages will use the default `template.njk` layout. Example: `layouts/default.html`, if your prototype has a `default` layout in the `app/views/layouts` directory. Always include the file extension, `.html` or `.njk`. |
| **defaultUnbrandedLayout** | string  | Optionally use an unbranded layout from your prototype for password and error pages. If no option is given rig pages will use either the defaultRigLayout if set, or the default `template.njk` layout. Example: `layouts/unbranded.html`.                                                                                                                                                                                                  |
| **nunjucksPaths**          | Array   | Search paths for Nunjucks macros. Default is `[]`.                                                                                                                                                                                                                                                                                                                                                                                          |
