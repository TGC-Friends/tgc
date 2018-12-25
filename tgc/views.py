from django.shortcuts import render, get_object_or_404
from .forms import initialForm
#from .models import Post

def initial_formview(request):

	context = {'nothing': 'nothing_yet'}

	formfields = initialForm()
	#print(formfields)
	return render(request, 'form.html', {'formfields': formfields})