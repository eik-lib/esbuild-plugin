/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/plugin.js > TAP > plugin() - import map fetched from a URL > import maps from urls 1`] = `
// fixtures/modules/file/main.js
import { html } from "https://cdn.eik.dev/lit-html/v2";
import { css } from "https://cdn.eik.dev/lit-html/v1";
import { LitElement } from "https://cdn.eik.dev/lit-element/v2";
var Inner = class extends LitElement {
  static get styles() {
    return [
      css\`
        :host {
          color: red;
        }
      \`
    ];
  }
  render(world) {
    return html\`<p>Hello \${world}!</p>\`;
  }
};
export {
  Inner as default
};

`

exports[`test/plugin.js > TAP > plugin() - import map fetched from a URL via eik.json > eik.json import-map string 1`] = `
// fixtures/modules/file/main.js
import { html } from "https://cdn.eik.dev/lit-html/v2";
import { css } from "https://cdn.eik.dev/lit-html/v1";
import { LitElement } from "https://cdn.eik.dev/lit-element/v2";
var Inner = class extends LitElement {
  static get styles() {
    return [
      css\`
        :host {
          color: red;
        }
      \`
    ];
  }
  render(world) {
    return html\`<p>Hello \${world}!</p>\`;
  }
};
export {
  Inner as default
};

`

exports[`test/plugin.js > TAP > plugin() - import maps via eik.json, URLs and direct definitions > import maps from eik.json, urls and direct definition 1`] = `
// fixtures/modules/file/main.js
import { html } from "https://cdn.eik.dev/lit-html/v2";
import { css } from "https://cdn.eik.dev/lit-html/v1";
import { LitElement } from "https://cdn.eik.dev/lit-element/v2";
var Inner = class extends LitElement {
  static get styles() {
    return [
      css\`
        :host {
          color: red;
        }
      \`
    ];
  }
  render(world) {
    return html\`<p>Hello \${world}!</p>\`;
  }
};
export {
  Inner as default
};

`

exports[`test/plugin.js > TAP > plugin() - import maps via package.json, URLs and direct definitions > import maps from eik.json, urls and direct definition 1`] = `
// fixtures/modules/file/main.js
import { html } from "https://cdn.eik.dev/lit-html/v2";
import { css } from "https://cdn.eik.dev/lit-html/v1";
import { LitElement } from "https://cdn.eik.dev/lit-element/v2";
var Inner = class extends LitElement {
  static get styles() {
    return [
      css\`
        :host {
          color: red;
        }
      \`
    ];
  }
  render(world) {
    return html\`<p>Hello \${world}!</p>\`;
  }
};
export {
  Inner as default
};

`
