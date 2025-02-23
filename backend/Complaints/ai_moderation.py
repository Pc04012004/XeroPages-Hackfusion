import requests
import os
from google.cloud import vision, videointelligence

# Load API Keys
PERSPECTIVE_API_KEY = "AIzaSyClrrJptAEwgdgmm3PyCoXb7IflrynDias"

# 🔹 Text Moderation (Google Perspective API)
def moderate_text(text):
    url = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze"
    params = {"key": PERSPECTIVE_API_KEY}
    data = {
        "comment": {"text": text},
        "languages": ["en"],
        "requestedAttributes": {"TOXICITY": {}, "SEVERE_TOXICITY": {}, "INSULT": {}, "THREAT": {}}
    }
    print("🔍 Sending request to Perspective API...")
    response = requests.post(url, params=params, json=data)

    if response.status_code == 200:
        result = response.json()
        print("🔎 API Response:", result)  # Print the full response for debugging
        toxicity_score = result["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
        severe_toxicity_score = result["attributeScores"]["SEVERE_TOXICITY"]["summaryScore"]["value"]
        insult_score = result["attributeScores"]["INSULT"]["summaryScore"]["value"]
        threat_score = result["attributeScores"]["THREAT"]["summaryScore"]["value"]

        if (
            toxicity_score > 0.4 or
            severe_toxicity_score > 0.3 or
            insult_score > 0.4 or
            threat_score > 0.3
        ):
            return False  # 🚨 Block if any score is high

        return True  # ✅ Safe text

    print("❌ API Error! Status Code:", response.status_code, "Response:", response.text)
    return False  # Block on API failure

# 🔹 Image Moderation (Google Vision AI)
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "backend\your_google_credentials.json"

# def moderate_image(image_path):
#     client = vision.ImageAnnotatorClient()
#     with open(image_path, "rb") as image_file:
#         content = image_file.read()
#     image = vision.Image(content=content)
#     response = client.safe_search_detection(image=image)
#     annotations = response.safe_search_annotation
#     print("run")
#     return annotations.adult != 4 and annotations.violence != 4  # ✅ True if safe
def moderate_image(image_path):
    print("acess")
    client = vision.ImageAnnotatorClient()
    
    with open(image_path, "rb") as image_file:
        content = image_file.read()
    
    image = vision.Image(content=content)
    response = client.safe_search_detection(image=image)
    annotations = response.safe_search_annotation

    # ✅ Print API response for debugging
    print("🔍 Google Vision Response:", annotations)

    # ✅ Make sure it's correctly detecting unsafe content
    if annotations.adult == 2 or annotations.violence == 4:
        print("❌ Inappropriate content detected!")
        return False  # 🚫 Block the image
    return True  # ✅ Allow the image

# 🔹 Video Moderation (Google Video Intelligence)
GCS_BUCKET_NAME = "hackfusion2025"
from google.cloud import videointelligence
from google.cloud import storage
import time

def upload_to_gcs(local_file_path, destination_blob_name):
    """Uploads a video file to Google Cloud Storage and returns the GCS URL."""
    client = storage.Client()
    bucket = client.bucket(GCS_BUCKET_NAME)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(local_file_path)
    
    return f"gs://{GCS_BUCKET_NAME}/{destination_blob_name}"

# def moderate_video(video_path):
#     client = videointelligence.VideoIntelligenceServiceClient()
#     with open(video_path, "rb") as video_file:
#         input_content = video_file.read()
#     response = client.annotate_video(
#         features=[videointelligence.Feature.EXPLICIT_CONTENT_DETECTION],
#         input_content=input_content,
#     )
#     for result in response.result.annotation_results:
#         for frame in result.explicit_annotation.frames:
#             if frame.pornography_likelihood >= 2:  # ❌ Unsafe Content
#                 return False
#     return True  # ✅ Safe Content

def moderate_video(video_path):
    print("video")
    """Detects explicit content in a video using Google Video Intelligence API."""
    client = videointelligence.VideoIntelligenceServiceClient()

    # 🔹 Upload video to GCS
    gcs_uri = upload_to_gcs(video_path, "moderation_videos/temp_video.mp4")

    # 🚀 Request explicit content detection
    operation = client.annotate_video(
        request={
            "features": [videointelligence.Feature.EXPLICIT_CONTENT_DETECTION],
            "input_uri": gcs_uri,  # ✅ Use GCS URL
        }
    )

    print("Processing video moderation...")
    result = operation.result(timeout=600)  # ⏳ Wait for results (max 10 minutes)

    # 🔍 Extract Safe Search results
    annotation_results = result.annotation_results[0]
    explicit_annotation = annotation_results.explicit_annotation

    for frame in explicit_annotation.frames:
        likelihood = frame.pornography_likelihood
        if likelihood >= 3:  # 🚨 Moderate (LIKELY or VERY_LIKELY)
            print("❌ Inappropriate video detected!")
            return False

    print("✅ Video is safe")
    return True

