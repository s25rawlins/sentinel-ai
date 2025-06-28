import nox

# Define Python versions to test against
nox.options.sessions = ["tests", "lint", "type_check"]


@nox.session(python=["3.9", "3.10", "3.11"])
def tests(session):
    """Run the test suite with pytest."""
    session.install("-r", "requirements.txt")
    session.install("-r", "requirements-dev.txt")
    
    # Run tests with coverage
    session.run(
        "pytest",
        "--cov=app",
        "--cov-report=term-missing",
        "--cov-report=html:htmlcov",
        "--cov-report=xml",
        "tests/",
        *session.posargs
    )


@nox.session
def lint(session):
    """Run linting tools."""
    session.install("-r", "requirements-dev.txt")
    
    # Run black for code formatting
    session.run("black", "--check", "app", "tests")
    
    # Run isort for import sorting
    session.run("isort", "--check-only", "app", "tests")
    
    # Run flake8 for style guide enforcement
    session.run("flake8", "app", "tests")


@nox.session
def type_check(session):
    """Run type checking with mypy."""
    session.install("-r", "requirements.txt")
    session.install("-r", "requirements-dev.txt")
    session.run("mypy", "app")


@nox.session
def format(session):
    """Format code with black and isort."""
    session.install("-r", "requirements-dev.txt")
    session.run("black", "app", "tests")
    session.run("isort", "app", "tests")


@nox.session
def safety(session):
    """Check for security vulnerabilities."""
    session.install("safety")
    session.run("safety", "check", "--file", "requirements.txt")


@nox.session
def docs(session):
    """Build documentation."""
    session.install("-r", "requirements.txt")
    session.install("sphinx", "sphinx-rtd-theme")
    session.run("sphinx-build", "-b", "html", "docs", "docs/_build/html")
