# Contributing

Thanks for helping improve KuyTanya.

## Local Setup

1. Fork and clone the repository.
2. Copy `.env.development.example` to `.env`.
3. Replace development secrets with local values.
4. Run `docker compose up --build`, or run the backend and frontend separately.

## Development Guidelines

- Keep configuration in environment variables.
- Keep handlers thin; put reusable business logic in `services` and database access in `repositories`.
- Prefer small, focused pull requests.
- Add or update tests when changing behavior.
- Run formatting and linting before opening a pull request.

## Pull Requests

Include a short description, testing notes, and any required environment changes.
