from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from utils.Scan.google_genai import genai_client

scanRouter = APIRouter(tags=["Scan"], responses={404: {"description": "Not found"}})


class ScanRequestBody(BaseModel):
    contents: str


@scanRouter.post(
    "/run-scan",
    description="API endpoint to run a scan",
    response_model=dict,
)
async def run_scan(
    body: ScanRequestBody,
) -> JSONResponse:
    try:
        print("Running scan with body:", body)

        response = genai_client.models.generate_content(
            model="gemini-2.5-flash", contents=body.contents
        )

        print("Scan response:", response)

        return JSONResponse(
            content={"message": "Scan started successfully", "response": response.text},
            status_code=200,
        )
    except Exception as e:
        print(f"❌ Error running scan: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
