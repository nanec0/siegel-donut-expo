def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_create_order(client):
    r = client.post("/api/v1/orders/", json={
        "establishment": "siegel-test",
        "table_number": "4A",
        "items": [{"product_id": 1, "product_name": "Classic Glazed", "quantity": 2, "unit_price": 1.50}]
    })
    assert r.status_code == 201
    assert r.json()["expo_status"] == "PENDING"

def test_list_orders(client):
    r = client.get("/api/v1/orders/")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
