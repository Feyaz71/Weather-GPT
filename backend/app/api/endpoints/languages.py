from fastapi import APIRouter
from typing import List
from app.localization.language_framework import locale_service, LanguageMetadata

router = APIRouter()


@router.get("/list", response_model=List[LanguageMetadata])
async def list_supported_languages():
    """Returns list of supported Indian languages with native scripts and text directions."""
    return locale_service.get_supported_languages()
