from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from rembg import remove
from PIL import Image
import io
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://text-behind-image-nine.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    image_data = await file.read()
    input_image = Image.open(io.BytesIO(image_data))
    
    # Process with rembg in a separate thread to avoid blocking the event loop
    output_image = await asyncio.to_thread(remove, input_image)
    
    # Return as PNG
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return Response(content=img_byte_arr.getvalue(), media_type="image/png")
