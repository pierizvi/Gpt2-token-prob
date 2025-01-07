from pydantic import BaseModel

class Prompt(BaseModel):
    prompt: str
    method: str = "greedy"  # Default method