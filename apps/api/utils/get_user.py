import os
from fastapi import HTTPException, Request, Depends
import httpx

from utils.schema.Ctx import Ctx


async def get_user(request: Request) -> Ctx:
    headers = request.headers

    cookie = headers.get("cookie")
    if not cookie:
        raise HTTPException(status_code=401, detail="Unauthorized")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{os.getenv('BETTER_AUTH_URL')}/api/auth/get-session",
            headers={"cookie": cookie},
        )

    if response.status_code != 200:
        raise HTTPException(401, "Invalid session")

    data = response.json()

    if not data:
        raise HTTPException(401, "Unauthorized")

    return Ctx(
        user=data.get("user"),
        session=data.get("session"),
    )
