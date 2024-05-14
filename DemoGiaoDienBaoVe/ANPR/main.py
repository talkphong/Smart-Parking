import cv2
import numpy as np
import imutils
from imutils import perspective
from skimage.filters import threshold_local
from ultralytics import YOLO #YOLOv8
from keras.models import load_model
import sys
from pathlib import Path

model = YOLO(Path(__file__).with_name("best.pt"))
model_detect_text = load_model(Path(__file__).with_name("alexnet_model.h5"))
print('load xong model')
sys.stdout.flush()

def recognize(image):
    boxes = []
    vehicle_plate = 0
    results = model(image, stream=True, verbose=False)
    for i in results:
        obj_pos = i.boxes
        for box in obj_pos:
            x1, y1, x2, y2 = box.xyxy[0]
            xmin, ymin, xmax, ymax = int(x1), int(y1), int(x2), int(y2)
            box = [xmin, ymin, xmax, ymax]
            boxes.append(box)

    if len(boxes) > 0 :
        # cv2.rectangle(image, (xmin,ymin),(xmax,ymax),(0,255,0),2)
        # cv2.imshow("detect", image)
        coord = np.array([[xmin, ymin], [xmax, ymin], [xmax, ymax], [xmin, ymax]])
        LpRegion = perspective.four_point_transform(image, coord)
        
        image = LpRegion.copy()
        # cv2.imshow("LpRegion",image) 

        LpRegion_copy = LpRegion.copy()
        LpRegion_copy = imutils.resize(LpRegion_copy, width=600)
        # cv2.imshow("LpRegion",LpRegion_copy)

        V = cv2.split(cv2.cvtColor(image, cv2.COLOR_BGR2HSV))[2]
        # adaptive threshold
        T = threshold_local(V, 35, offset=5, method="gaussian")
        thresh = (V > T).astype("uint8") * 255
        thresh = cv2.bitwise_not(thresh)
        thresh = imutils.resize(thresh, width=600)

        _, labels = cv2.connectedComponents(thresh)
        mask = np.zeros(thresh.shape, dtype="uint8")
        total_pixels = thresh.shape[0] * thresh.shape[1]
        lower = total_pixels // 90
        upper = total_pixels // 20
        for label in np.unique(labels):
            if label == 0:
                continue
            labelMask = np.zeros(thresh.shape, dtype="uint8")
            labelMask[labels == label] = 255
            numPixels = cv2.countNonZero(labelMask)
            if numPixels > lower and numPixels < upper:
                mask = cv2.add(mask, labelMask)

        # cv2.imshow('mask.copy()', mask.copy())
        cnts, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        boundingBoxes = [cv2.boundingRect(c) for c in cnts]
        boundingBoxes = np.array(boundingBoxes)
        # print("lenbounding" + str(len(boundingBoxes)))
        if len(boundingBoxes) >= 8:
            mean_w = np.mean(boundingBoxes[:, 2])
            mean_h = np.mean(boundingBoxes[:, 3])
            mean_y = np.mean(boundingBoxes[:,1])
            threshold_w = mean_w * 1.5
            threshold_h = mean_h * 1.5
            new_boundingBoxes = boundingBoxes[(boundingBoxes[:, 2] < threshold_w) & (boundingBoxes[:, 3] < threshold_h)]
            line1 = []
            line2 = []
            for box in new_boundingBoxes:
                x,y,w,h = box
                if y > mean_y * 1.2:
                    line2.append(box)
                else:
                    line1.append(box)

            line1 = sorted(line1, key=lambda box: box[0])
            line2 = sorted(line2, key=lambda box: box[0])
            boundingBoxes = line1+line2

            image = imutils.resize(image.copy(), width=600)

            # Character Recognition

            chars = [
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z'
            ]

            vehicle_plate = ""
            characters = []
            # i=0
            for rect in boundingBoxes:
                x, y, w, h = rect
                character = mask[y:y+h, x:x+w]
                character = cv2.bitwise_not(character)
                rows = character.shape[0]
                columns = character.shape[1]
                paddingY = (128 - rows) // 2 if rows < 128 else int(0.17 * rows)
                paddingX = (
                    128 - columns) // 2 if columns < 128 else int(0.45 * columns)
                character = cv2.copyMakeBorder(character, paddingY, paddingY,
                                            paddingX, paddingX, cv2.BORDER_CONSTANT, None, 255)

                character = cv2.cvtColor(character, cv2.COLOR_GRAY2RGB)
                character = cv2.resize(character, (227, 227))
                
                # cv2.imshow("character" + str(i), character)
                # i+=1

                character = character.astype("float") / 255.0
                characters.append(character)
            characters = np.array(characters)
            probs = model_detect_text.predict(characters,verbose=False)
            for prob in probs:
                idx = np.argsort(prob)[-1]
                vehicle_plate += chars[idx]
    # print(processedImg)
    # return vehicle_plate
            return [boxes[0], vehicle_plate]
        return [boxes[0], "-1"] # Không nhận diện đủ 8 chữ số
    return ["-1", "-1"] # Không tìm thấy biển số



# def main():
    # cap = cv2.VideoCapture(0)
    # cap = cv2.VideoCapture("video.mp4")
    # while True:
    #     ret, frame = cap.read()

    #     # frame = cv2.resize(frame, (600,1000), interpolation=cv2.INTER_LINEAR)

    #     cv2.imshow('Original Frame', frame)
    #     string = recognize(frame)
    #     print(string)
    #     sys.stdout.flush()
    #     key = cv2.waitKey(1)

    #     if key == 27:  # Bấm phím Esc để thoát
    #         break

    # cap.release()  # Giải phóng webcam
    # cv2.destroyAllWindows()  # Đóng tất cả cửa sổ hiển thị

    
        
    


# if __name__ == "__main__":
#     main()