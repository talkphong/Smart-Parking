from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
import main

app = FastAPI()

@app.get("/")
async def home():
    return "this is home!"

@app.post("/process_image")
async def process_image(image: UploadFile = File(...)):
    img_np = np.frombuffer(image.file.read(), np.uint8)
    img_cv2 = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
    result = main.recognize(img_cv2)
    print(result)
    print(result[0][0])
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)