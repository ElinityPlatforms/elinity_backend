import phonenumbers
from phonenumbers import PhoneNumberFormat
from fastapi import HTTPException, status

def normalize_phone(phone: str, default_region: str = "IN") -> str:
    """
    Normalizes a phone number to E.164 format (e.g., +918200252850).
    If the number is invalid or cannot be parsed, raises an HTTPException.
    """
    if not phone:
        return None
    
    try:
        # Parse the phone number
        # If it doesn't start with '+', it uses the default_region
        parsed_number = phonenumbers.parse(phone, default_region)
        
        # Check if the number is actually possible/valid
        if not phonenumbers.is_valid_number(parsed_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid phone number format for region {default_region}"
            )
            
        # Standardize to E.164 format (+91xxxxxxxxxx)
        normalized = phonenumbers.format_number(parsed_number, PhoneNumberFormat.E164)
        return normalized
        
    except Exception as e:
        # If parsing fails altogether
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not process phone number. Please include country code if outside India."
        )
