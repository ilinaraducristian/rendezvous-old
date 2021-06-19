import {render, screen} from "@testing-library/react";
import React from "react";
import ChannelComponent from "./ChannelComponent";

test('channel pure component', () => {
  render(<ChannelComponent id={1} name={"test channel"} onSelectChannel={() => {
  }}/>);
  const buttonElement = screen.getByText('test channel');
  expect(buttonElement).toBeInTheDocument();
});
