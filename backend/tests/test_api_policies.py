"""Tests for policies API endpoints."""

import pytest
from fastapi import status
from app.models.policy import Policy as PolicyModel


@pytest.mark.api
class TestPoliciesAPI:
    """Test cases for policies API endpoints."""

    def test_get_policies_empty(self, client):
        """Test getting policies when none exist."""
        response = client.get("/api/policies/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []

    def test_create_policy(self, client, sample_policy_data):
        """Test creating a new policy."""
        response = client.post("/api/policies/", json=sample_policy_data)
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["name"] == sample_policy_data["name"]
        assert data["description"] == sample_policy_data["description"]
        assert data["category"] == sample_policy_data["category"]
        assert data["is_active"] == sample_policy_data["is_active"]
        assert "id" in data
        assert "created_at" in data
        assert "estimated_cost_per_event" in data
        assert "estimated_latency_ms" in data

    def test_get_policy_by_id(self, client, sample_policy_data):
        """Test getting a specific policy by ID."""
        # Create a policy first
        create_response = client.post("/api/policies/", json=sample_policy_data)
        policy_id = create_response.json()["id"]
        
        # Get the policy
        response = client.get(f"/api/policies/{policy_id}")
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["id"] == policy_id
        assert data["name"] == sample_policy_data["name"]

    def test_get_policy_not_found(self, client):
        """Test getting a policy that doesn't exist."""
        response = client.get("/api/policies/999")
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Policy not found" in response.json()["detail"]

    def test_update_policy(self, client, sample_policy_data):
        """Test updating an existing policy."""
        # Create a policy first
        create_response = client.post("/api/policies/", json=sample_policy_data)
        policy_id = create_response.json()["id"]
        
        # Update the policy
        update_data = {"name": "Updated Policy Name", "is_active": False}
        response = client.put(f"/api/policies/{policy_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["name"] == "Updated Policy Name"
        assert data["is_active"] == False

    def test_update_policy_not_found(self, client):
        """Test updating a policy that doesn't exist."""
        update_data = {"name": "Updated Policy Name"}
        response = client.put("/api/policies/999", json=update_data)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_policy(self, client, sample_policy_data):
        """Test deleting a policy."""
        # Create a policy first
        create_response = client.post("/api/policies/", json=sample_policy_data)
        policy_id = create_response.json()["id"]
        
        # Delete the policy
        response = client.delete(f"/api/policies/{policy_id}")
        assert response.status_code == status.HTTP_200_OK
        assert "deleted successfully" in response.json()["message"]
        
        # Verify it's deleted
        get_response = client.get(f"/api/policies/{policy_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_policy_not_found(self, client):
        """Test deleting a policy that doesn't exist."""
        response = client.delete("/api/policies/999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_policies_with_filters(self, client, sample_policy_data):
        """Test getting policies with status and category filters."""
        # Create multiple policies
        policy1 = sample_policy_data.copy()
        policy1["category"] = "content_safety"
        policy1["name"] = "Policy 1"
        
        policy2 = sample_policy_data.copy()
        policy2["category"] = "bias_detection"
        policy2["name"] = "Policy 2"
        
        client.post("/api/policies/", json=policy1)
        client.post("/api/policies/", json=policy2)
        
        # Test category filter
        response = client.get("/api/policies/?category=content_safety")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["category"] == "content_safety"

    def test_get_policies_pagination(self, client, sample_policy_data):
        """Test pagination parameters."""
        # Create multiple policies
        for i in range(5):
            policy = sample_policy_data.copy()
            policy["name"] = f"Policy {i}"
            client.post("/api/policies/", json=policy)
        
        # Test limit
        response = client.get("/api/policies/?limit=3")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 3
        
        # Test skip
        response = client.get("/api/policies/?skip=2&limit=2")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 2

    def test_test_policy(self, client, sample_policy_data):
        """Test the policy testing endpoint."""
        # Create a policy first
        create_response = client.post("/api/policies/", json=sample_policy_data)
        policy_id = create_response.json()["id"]
        
        # Test the policy
        test_data = {"content": "This is test content"}
        response = client.post(f"/api/policies/{policy_id}/test", json=test_data)
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["policy_id"] == policy_id
        assert "test_passed" in data
        assert "confidence_score" in data
        assert "evaluation_time_ms" in data

    def test_test_policy_not_found(self, client):
        """Test testing a policy that doesn't exist."""
        test_data = {"content": "This is test content"}
        response = client.post("/api/policies/999/test", json=test_data)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_policy_templates(self, client):
        """Test getting policy templates."""
        response = client.get("/api/policies/templates/")
        assert response.status_code == status.HTTP_200_OK
        # The response should be a list (might be empty in test environment)
        assert isinstance(response.json(), list)

    def test_policy_performance_mode_calculations(self, client, sample_policy_data):
        """Test that performance mode affects cost and latency calculations."""
        # Test fast mode
        fast_policy = sample_policy_data.copy()
        fast_policy["performance_mode"] = "fast"
        fast_policy["name"] = "Fast Policy"
        
        response = client.post("/api/policies/", json=fast_policy)
        fast_data = response.json()
        
        # Test robust mode
        robust_policy = sample_policy_data.copy()
        robust_policy["performance_mode"] = "robust"
        robust_policy["name"] = "Robust Policy"
        
        response = client.post("/api/policies/", json=robust_policy)
        robust_data = response.json()
        
        # Robust should have higher cost and latency than fast
        assert robust_data["estimated_cost_per_event"] > fast_data["estimated_cost_per_event"]
        assert robust_data["estimated_latency_ms"] > fast_data["estimated_latency_ms"]
