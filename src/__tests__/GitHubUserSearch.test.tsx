import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GitHubUserSearch from "../components/GitHubUserSearch";

global.fetch = jest.fn();

describe("GitHubUserSearch", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("renders input and button", () => {
    render(<GitHubUserSearch />);
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("focuses input on mount", () => {
    render(<GitHubUserSearch />);
    const input = screen.getByPlaceholderText(/enter username/i);
    expect(document.activeElement).toBe(input);
  });

  it("shows loading and displays users after search", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        items: [
          {
            id: 1,
            login: "octocat",
            avatar_url: "https://avatar",
            html_url: "#",
          },
        ],
      }),
    });

    render(<GitHubUserSearch />);
    const input = screen.getByPlaceholderText(/enter username/i);
    fireEvent.change(input, { target: { value: "octocat" } });

    fireEvent.submit(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("octocat")).toBeInTheDocument()
    );
  });
});
