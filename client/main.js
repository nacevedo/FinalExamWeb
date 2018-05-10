import { Meteor } from "meteor/meteor";
import React from "react";
import {render} from "react-dom";

import App from "../imports/ui/App";
import '../imports/startup/accounts-config.js';


Meteor.startup(() => {
  render(<App></App>,
    document.getElementById("render-target"));
});