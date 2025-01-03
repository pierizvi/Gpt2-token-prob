from fastapi import APIRouter, HTTPException
from transformers import GPT2Tokenizer, GPT2LMHeadModel
from .models import Prompt
import torch

router = APIRouter()

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

@router.post("/tokenize")
async def tokenize(prompt: Prompt):
    tokens = tokenizer.tokenize(prompt.prompt)
    return {"tokens": tokens}

@router.post("/probabilities")
async def probabilities(prompt: Prompt):
    inputs = tokenizer(prompt.prompt, return_tensors="pt")
    outputs = model(**inputs)
    probs = outputs.logits.softmax(dim=-1)
    return {"probabilities": probs.tolist()}

@router.post("/generate")
async def generate(prompt: Prompt):
    inputs = tokenizer(prompt.prompt, return_tensors="pt")
    outputs = model.generate(**inputs, output_scores=True, return_dict_in_generate=True, max_new_tokens=50)
    generated_text = tokenizer.decode(outputs.sequences[0], skip_special_tokens=True)
    
    # Tokenize the generated text
    tokenized_text = tokenizer.tokenize(generated_text)

    # Get the probabilities of the generated tokens
    probs = torch.stack(outputs.scores, dim=1).softmax(-1)
    token_probs = []
    for i, token_id in enumerate(outputs.sequences[0][inputs['input_ids'].shape[-1]:]):  # Skip the initial input tokens
        token_probs.append({
            "token": tokenizer.decode(token_id),
            "probability": probs[0, i, token_id].item()
        })

    # Tokenize the prompt
    tokenized_prompt = tokenizer.tokenize(prompt.prompt)

    return {"generated_text": generated_text, "tokenized_prompt": tokenized_prompt, "token_probabilities": token_probs}