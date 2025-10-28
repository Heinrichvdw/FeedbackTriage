/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SubmitFeedback from "@/components/SubmitFeedback";

describe("SubmitFeedback", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it("submits feedback successfully and shows success message", async () => {
    const mockResponse = Promise.resolve({
      ok: true,
      json: async () => ({ id: 1 }),
    } as any);

    global.fetch = jest.fn(() => mockResponse) as any;

    render(<SubmitFeedback onSuccess={() => {}} />);

    const emailInput = screen.getByLabelText(
      /Email \(optional\)/i
    ) as HTMLInputElement;
    const textInput = screen.getByLabelText(
      /Feedback \*/i
    ) as HTMLTextAreaElement;
    const button = screen.getByRole("button", { name: /submit feedback/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(textInput, { target: { value: "  This is feedback.  " } });

    fireEvent.click(button);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/feedback",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "This is feedback.",
          email: "test@example.com",
        }),
      })
    );

    await waitFor(() =>
      expect(
        screen.getByText(/Feedback submitted successfully!/i)
      ).toBeInTheDocument()
    );

    expect(textInput.value).toBe("");
    expect(emailInput.value).toBe("");
  });

  it("displays server error message when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: async () => ({ error: "Bad request" }),
      })
    ) as any;

    render(<SubmitFeedback onSuccess={() => {}} />);
    const textInput = screen.getByLabelText(/Feedback \*/i);
    const button = screen.getByRole("button", { name: /submit feedback/i });

    fireEvent.change(textInput, { target: { value: "problem" } });
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText(/Bad request/i)).toBeInTheDocument()
    );
  });

  it("shows validation error when feedback is empty and does not call fetch", async () => {
    global.fetch = jest.fn();
    render(<SubmitFeedback onSuccess={() => {}} />);
    const textInput = screen.getByLabelText(/Feedback \*/i);
    const button = screen.getByRole("button", { name: /submit feedback/i });

    // Fill with only whitespace so HTML required doesn't block and component validation runs
    fireEvent.change(textInput, { target: { value: "   " } });
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText(/Feedback cannot be empty/i)).toBeInTheDocument()
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
