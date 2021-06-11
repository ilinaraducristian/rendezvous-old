import {render, screen} from "@testing-library/react";
import React from "react";
import Channel from "./Channel";

test('channel pure component', () => {
  render(<Channel id={1} name={'test channel'} onSelectChannel={() => {}}/>);
  const buttonElement = screen.getByText('test channel');
  expect(buttonElement).toBeInTheDocument();
});
