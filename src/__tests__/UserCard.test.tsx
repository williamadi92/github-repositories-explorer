import { render, screen, fireEvent } from "@testing-library/react";
import UserCard from "../components/UserCard";

global.fetch = jest.fn();

const mockUser = {
  id: 1,
  login: "octocat",
  avatar_url: "https://avatar",
};

describe("UserCard", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("renders collapsed card with username and avatar", () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("octocat")).toBeInTheDocument();
    expect(screen.getByAltText("octocat")).toBeInTheDocument();
  });

  it("expands and loads repos on click", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        {
          id: 101,
          name: "repo1",
          html_url: "https://github.com/octocat/repo1",
          description: "A test repo",
          stargazers_count: 10,
        },
      ],
    });

    render(<UserCard user={mockUser} />);
    fireEvent.click(screen.getByText("octocat")); // expand

    expect(await screen.findByText("repo1")).toBeInTheDocument();
    expect(screen.getByText("A test repo")).toBeInTheDocument();
  });

  it("shows 'No repositories' if empty", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [],
    });

    render(<UserCard user={mockUser} />);
    fireEvent.click(screen.getByText("octocat")); // expand

    expect(await screen.findByText(/no repositories/i)).toBeInTheDocument();
  });
});
