from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatQueryRequest, ChatQueryResponse
from app.ai.orchestrator import ai_orchestrator
from app.core.logging import logger

router = APIRouter()


@router.post("", response_model=ChatQueryResponse)
async def process_conversational_query(request: ChatQueryRequest):
    """
    Primary Conversational AI Query endpoint.
    Accepts natural language weather queries in English or Hindi,
    orchestrates authoritative data retrieval, executes risk engines, and returns grounded answers.
    """
    try:
        response = await ai_orchestrator.process_chat(request)
        return response
    except Exception as e:
        logger.error(f"Error in chat processing: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Weather intelligence processing error: {str(e)}")
