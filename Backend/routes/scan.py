import logging
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from google.genai import types
from utils.Scan.google_genai import genai_client
from utils.GithubScrapper.Scrapper import (
    get_github_client,
    get_file_content,
    get_folder_structure,
)
import json
import re


# Configure logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

scanRouter = APIRouter(tags=["Scan"], responses={404: {"description": "Not found"}})


class ScanRequestBody(BaseModel):
    access_token: str
    repo_name: str


@scanRouter.post(
    "/run-scan",
    description="API endpoint to run a scan",
    response_model=dict,
)
async def run_scan(
    body: ScanRequestBody,
) -> JSONResponse:
    try:

        github_client = get_github_client(body.access_token)
        logger.debug("🔗 GitHub client created successfully.")

        fileStructure = {}
        readmeContent = ""

        fileStructure = get_folder_structure(github_client.get_repo(body.repo_name))
        logger.debug("📂 Folder structure retrieved successfully.")

        readmeContent = get_file_content(
            github_client.get_repo(body.repo_name), "README.md"
        )
        logger.debug("📄 README content retrieved successfully.")

        logger.debug("🔍 Starting scan process...")
        logger.debug(f"📥 Received request body: {body}")

        # Load prompt template
        logger.debug("📜 Loading prompt template...")
        with open("prompts/run1.txt", "r", encoding="utf-8") as file:
            prompt_template = file.read()
        logger.debug("✅ Loaded prompt template.")

        # Format prompt
        logger.debug("📝 Formatting prompt...")
        prompt = (
            f"### Prompt for Google GenAI\n\n {prompt_template}\n\n  ### README Content:\n\n{readmeContent}\n\n### Folder Structure:\n\n"
            f"{json.dumps(fileStructure, indent=2)}"
        )
        logger.debug(f"✅ Formatted prompt: {prompt[:200]}...")

        logger.debug("🔍 Running scan with Google GenAI...")
        logger.debug("Prompt for Google GenAI: %s", prompt)

        response = genai_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=3000,
            ),
        )

        # Extract the JSON string wrapped inside triple backticks from the first candidate's first part's text
        # Validate response structure before accessing attributes
        if not response.candidates or not response.candidates[0].content:
            raise ValueError("Invalid response: Missing candidates or content.")

        content = response.candidates[0].content
        if not content.parts or not content.parts[0].text:
            raise ValueError("Invalid response: Missing parts or text in content.")

        raw_text: str = content.parts[0].text
        logger.debug(f"Raw response text from AI:\n{raw_text[:300]}...")

        # Use regex to extract JSON inside ```json ... ```
        match = re.search(r"```json\s*(\{.*\})\s*```", raw_text, re.DOTALL)
        if match:
            json_str = match.group(1)  # Extract the JSON string
        else:
            # fallback if no markdown block found, try raw text
            json_str = raw_text.strip()

        # Parse the JSON string to dict
        parsed_response = json.loads(json_str)

        return JSONResponse(
            content={
                "message": "Scan completed successfully",
                "response": {
                    "status": "success",
                    "data": parsed_response,
                },
            },
            status_code=200,
        )

    except Exception as e:
        logger.error(f"❌ Error running scan: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
