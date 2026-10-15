from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.main import app
from backend.app.database import Base, get_db

# Isolated in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="function")
def client():
    # Ensure fresh schema for each test run
    Base.metadata.create_all(bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

    Base.metadata.drop_all(bind=test_engine)
    app.dependency_overrides.clear()

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_student(client):
    payload = {
        "student_id": "S001",
        "full_name": "Alice Example",
        "date_of_birth": "2000-01-01",
        "email": "alice@example.com",
        "phone": None,
        "address": "123 Main St"
    }
    response = client.post("/students/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["student_id"] == payload["student_id"]
    assert data["full_name"] == payload["full_name"]

def test_duplicate_student_id(client):
    payload = {
        "student_id": "S002",
        "full_name": "Bob Duplicate",
        "date_of_birth": "1999-05-05",
        "email": "bob@example.com",
        "phone": None,
        "address": None
    }
    client.post("/students/", json=payload)
    response = client.post("/students/", json=payload)
    assert response.status_code == 409

def test_missing_contact(client):
    payload = {
        "student_id": "S003",
        "full_name": "No Contact",
        "date_of_birth": "1995-03-10",
        "email": None,
        "phone": None,
        "address": None
    }
    response = client.post("/students/", json=payload)
    assert response.status_code == 422  # validation error from Pydantic

def test_list_and_search(client):
    # Add two students
    client.post("/students/", json={
        "student_id": "S004",
        "full_name": "Charlie Search",
        "date_of_birth": "2001-07-07",
        "email": "charlie@example.com",
        "phone": None,
        "address": None
    })
    client.post("/students/", json={
        "student_id": "S005",
        "full_name": "Dana Search",
        "date_of_birth": "2002-08-08",
        "email": None,
        "phone": "555-1234",
        "address": None
    })
    # List all
    resp_all = client.get("/students/")
    assert resp_all.status_code == 200
    assert len(resp_all.json()) >= 2
    # Search by name
    resp_search = client.get("/students/", params={"search": "Charlie"})
    assert resp_search.status_code == 200
    results = resp_search.json()
    assert any(s["student_id"] == "S004" for s in results)

def test_get_update_delete_student(client):
    payload = {
        "student_id": "S006",
        "full_name": "Eve Update",
        "date_of_birth": "1998-12-12",
        "email": "eve@example.com",
        "phone": None,
        "address": None
    }
    create_resp = client.post("/students/", json=payload)
    assert create_resp.status_code == 201
    # Get
    get_resp = client.get(f"/students/{payload['student_id']}")
    assert get_resp.status_code == 200
    # Update
    update_payload = {"full_name": "Eve Updated"}
    upd_resp = client.put(f"/students/{payload['student_id']}", json=update_payload)
    assert upd_resp.status_code == 200
    assert upd_resp.json()["full_name"] == "Eve Updated"
    # Delete
    del_resp = client.delete(f"/students/{payload['student_id']}")
    assert del_resp.status_code == 204
    # Verify deletion
    get_again = client.get(f"/students/{payload['student_id']}")
    assert get_again.status_code == 404
