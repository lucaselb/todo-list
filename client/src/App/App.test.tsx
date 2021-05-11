import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import App from "./App";

afterEach(cleanup);

test("renders intro text", () => {
  render(<App />);

  const introElement = screen.getByText(/TODO List/i);
  const items = screen.getByText("Item(s)", { exact: false });

  expect(introElement).toBeInTheDocument();
  expect(items).toBeInTheDocument();
});

test("opens add modal", async () => {
  render(<App />);

  fireEvent.click(screen.getByText("Add"));
  await waitFor(() => screen.getByText("Add Item"));

  const modalTitle = screen.getByText(/Add Item/i);
  const closeBtn = screen.getByText(/Close/i);
  const addBtn = document.querySelector(".primary");

  expect(modalTitle).toBeInTheDocument();
  expect(closeBtn).toBeInTheDocument();
  expect(addBtn).toBeInTheDocument();
});
