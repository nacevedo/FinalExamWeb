import React from "react";
import { shallow, mount, render } from 'enzyme';
import { assert } from "meteor/practicalmeteor:chai";
import Home from "./Home.js";


describe("Home", () => {
  it("should render", () => {

    const controls = shallow(<Home updateCity={console.log("home")}></Home>);
    assert.equal(controls.find("p").length, 7);
  });
});