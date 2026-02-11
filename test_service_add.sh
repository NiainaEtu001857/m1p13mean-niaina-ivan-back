#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-"http://localhost:3000"}
SHOP_EMAIL=${SHOP_EMAIL:-"shop_test_$(date +%s)@example.com"}
SHOP_PASS=${SHOP_PASS:-"TestPass123!"}
SHOP_NAME=${SHOP_NAME:-"Test Shop"}
SHOP_TYPE=${SHOP_TYPE:-"Auto"}
SHOP_DESC=${SHOP_DESC:-"Test shop created by script"}

SERVICE_NAME=${SERVICE_NAME:-"Oil Change"}
SERVICE_BRAND=${SERVICE_BRAND:-"Generic"}
SERVICE_TYPE=${SERVICE_TYPE:-"maintenance"}
SERVICE_MIN_QTY=${SERVICE_MIN_QTY:-1}
SERVICE_BASE_UNITY=${SERVICE_BASE_UNITY:-"unit"}

create_shop_resp=$(curl -sS -X POST "$BASE_URL/shop/create" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$SHOP_NAME\",\"type\":\"$SHOP_TYPE\",\"description\":\"$SHOP_DESC\",\"email\":\"$SHOP_EMAIL\",\"password\":\"$SHOP_PASS\"}")

# Extract token and shop id (user._id) without jq
SHOP_TOKEN=$(CREATE_SHOP_RESP="$create_shop_resp" python3 - <<'PY'
import json,os
obj=json.loads(os.environ.get("CREATE_SHOP_RESP",""))
print(obj.get('token',''))
PY
)

SHOP_ID=$(CREATE_SHOP_RESP="$create_shop_resp" python3 - <<'PY'
import json,os
obj=json.loads(os.environ.get("CREATE_SHOP_RESP",""))
user=obj.get('user') or {}
print(user.get('_id',''))
PY
)

if [ -z "$SHOP_TOKEN" ] || [ -z "$SHOP_ID" ]; then
  echo "Failed to create shop or parse token/shop id. Response:" >&2
  echo "$create_shop_resp" >&2
  exit 1
fi

add_service_resp=$(curl -sS -X POST "$BASE_URL/shop/service/add" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SHOP_TOKEN" \
  -d "{\"name\":\"$SERVICE_NAME\",\"brand\":\"$SERVICE_BRAND\",\"type\":\"$SERVICE_TYPE\",\"shop\":\"$SHOP_ID\",\"min_quantity\":$SERVICE_MIN_QTY,\"base_unity\":\"$SERVICE_BASE_UNITY\"}")

token_payload=$(SHOP_TOKEN="$SHOP_TOKEN" python3 - <<'PY'
import os, json, base64
token = os.environ.get("SHOP_TOKEN","")
parts = token.split(".")
if len(parts) < 2:
    print("Invalid token")
else:
    payload = parts[1] + "=" * (-len(parts[1]) % 4)
    data = base64.urlsafe_b64decode(payload.encode("utf-8"))
    print(json.dumps(json.loads(data.decode("utf-8")), indent=2))
PY
)

echo "Create shop response:"
echo "$create_shop_resp"

echo

echo "Token payload:"
echo "$token_payload"

echo

echo "Add service response:"
echo "$add_service_resp"
