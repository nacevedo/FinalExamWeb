import React from "react";
import { shallow, mount, render } from 'enzyme';
import { assert } from "meteor/practicalmeteor:chai";
import PostAlone from "./PostAlone.js";


describe("PostAlone", () => {
  it("should render", () => {

    const controls = shallow(<PostAlone postID={console.log("PostAlone")}></PostAlone>);
    assert.equal(controls.find(".col-sm-4").length, 0);
    assert.equal(controls.find(".col-sm-8").length, 0);
  });
});