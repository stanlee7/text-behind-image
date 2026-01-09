from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    image_data = await file.read()
    input_image = Image.open(io.BytesIO(image_data))
    
    # Process with rembg
    output_image = remove(input_image)
    
    # Return as PNG
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return Response(content=img_byte_arr.getvalue(), media_type="image/png")

from fastapi.responses import Response
