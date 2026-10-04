from fastapi import Request, Depends


async def get_user(request: Request):
    headers = request.headers

    # Example
    cookie = headers.get("cookie")
    authorization = headers.get("authorization")

    # verify Better Auth session here
    print(f"Cookie: {cookie}, Authorization: {authorization}")
