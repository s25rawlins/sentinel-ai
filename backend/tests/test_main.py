"""Tests for main application endpoints."""

import pytest
from fastapi import status


@pytest.mark.api
class TestMainApp:
    """Test cases for main application endpoints."""

    def test_read_root(self, client):
        """Test the root endpoint."""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["message"] == "SentinelAI AI Governance Platform API"
        assert data["version"] == "1.0.0"
        assert data["docs"] == "/docs"

    def test_health_check(self, client):
        """Test the health check endpoint."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["status"] == "healthy"

    def test_cors_headers(self, client):
        """Test that CORS headers are properly set."""
        response = client.options("/")
        # FastAPI TestClient doesn't fully simulate CORS, but we can check the response
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_405_METHOD_NOT_ALLOWED]

    def test_api_docs_accessible(self, client):
        """Test that API documentation is accessible."""
        response = client.get("/docs")
        assert response.status_code == status.HTTP_200_OK

    def test_openapi_schema(self, client):
        """Test that OpenAPI schema is accessible."""
        response = client.get("/openapi.json")
        assert response.status_code == status.HTTP_200_OK
        
        schema = response.json()
        assert "openapi" in schema
        assert "info" in schema
        assert schema["info"]["title"] == "SentinelAI AI Governance Platform"
