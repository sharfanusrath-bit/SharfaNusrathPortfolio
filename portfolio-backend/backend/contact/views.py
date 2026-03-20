from django.shortcuts import render

# Create your views here.
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def contact_view(request):
    try:
        data = request.data
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        
        send_mail(
            f"New Contact Message from {name}",
            f"From: {email}\n\nMessage:\n{message}",
            'sharfanusrath@gmail.com',
            ['sharfanusrath@gmail.com'],
        )
        return Response({"status": "sent"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)