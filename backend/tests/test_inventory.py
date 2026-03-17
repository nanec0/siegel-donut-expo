def test_get_inventory(client):
    r = client.get("/api/v1/inventory/")
    assert r.status_code == 200

def test_get_products(client):
    r = client.get("/api/v1/products/")
    assert r.status_code == 200
    data = r.json()
    assert "objects" in data
    assert len(data["objects"]) > 0
