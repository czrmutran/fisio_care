from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse


def homepage(request):
    return redirect("polls/homepage.html")