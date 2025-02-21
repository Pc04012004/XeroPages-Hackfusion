import requests
import os
from google.cloud import vision, videointelligence
from google.cloud import perspective_v1

# Load API Keys
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "your_google_credentials.json"

# 🔹 Text Moderation (Google Perspective API)
def moderate_text(text):
    url = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze"
    params = {"key": "YOUR_PERSPECTIVE_API_KEY"}
    data = {
        "comment": {"text": text},
        "languages": ["en"],
        "requestedAttributes": {"TOXICITY": {}}
    }
    response = requests.post(url, params=params, json=data)
    if response.status_code == 200:
        score = response.json()["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
        return score < 0.6  # True if safe, False if toxic
    return False  # Block on error

# 🔹 Image Moderation (Google Vision AI)
def moderate_image(image_path):
    client = vision.ImageAnnotatorClient()
    with open(image_path, "rb") as image_file:
        content = image_file.read()
    image = vision.Image(content=content)
    response = client.safe_search_detection(image=image)
    annotations = response.safe_search_annotation
    return annotations.adult != 4 and annotations.violence != 4  # True if safe

# 🔹 Video Moderation (Google Video Intelligence)
def moderate_video(video_path):
    client = videointelligence.VideoIntelligenceServiceClient()
    with open(video_path, "rb") as video_file:
        input_content = video_file.read()
    response = client.annotate_video(
        features=[videointelligence.Feature.EXPLICIT_CONTENT_DETECTION],
        input_content=input_content,
    )
    for result in response.result.annotation_results:
        for frame in result.explicit_annotation.frames:
            if frame.pornography_likelihood >= 4:  # Unsafe
                return False
    return True  # Safe
