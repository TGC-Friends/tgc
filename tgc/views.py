from django.shortcuts import render, get_object_or_404
from .forms import initialForm
#from .models import Post
import urllib3
import json

def initial_formview(request):

	context = {'nothing': 'nothing_yet'}

	if request.method == 'POST':
		formfields = initialForm(request.POST)

		if formfields.is_valid():
			#formfields.is_valid()
			#formfields.save()

			#print(formfields)
			returnDict = {
			'bridename' : formfields.cleaned_data['bridename'],
			'groomname' : formfields.cleaned_data['groomname'],
			'phonenum' : formfields.cleaned_data['phonenum'],
			'emailfield' : formfields.cleaned_data['emailfield'],
			'howdidyouhear' : formfields.cleaned_data['howdidyouhear'],
			'eventdate1' : formfields.cleaned_data['eventdate1'],
			'eventtype1' : formfields.cleaned_data['eventtype1'],
			'eventvenue1' : formfields.cleaned_data['eventvenue1'],
			'eventdate2' : formfields.cleaned_data['eventdate2'],
			'eventtype2' : formfields.cleaned_data['eventtype2'],
			'eventvenue2' : formfields.cleaned_data['eventvenue2'],
			'requiredoutfit' : formfields.cleaned_data['requiredoutfit'],
			'noofgowns' : formfields.cleaned_data['noofgowns'],
			'preferredoutfit' : formfields.cleaned_data['preferredoutfit'],
			'preferredoutOthers' : formfields.cleaned_data['preferredoutOthers'],
			'preferredstyle' : formfields.cleaned_data['preferredstyle'],
			'preferredstyleOthers' : formfields.cleaned_data['preferredstyleOthers'],
			'preferredNeckline' : formfields.cleaned_data['preferredNeckline'],
			'preferredNeckOthers' : formfields.cleaned_data['preferredNeckOthers'],



			}
			print(returnDict)

		else:
			print('form not valid.')
			returnDict = {
			'bride_name' : formfields.data['bridename'],
			'groom_name' : formfields.data['groomname'],
			'phone_num' : formfields.data['phonenum'],
			'email' : formfields.data['emailfield'],
			'how_did_you_hear' : formfields.data['howdidyouhear'],
			'eventdate1' : formfields.data['eventdate1'],
			'eventtype1' : formfields.data['eventtype1'],
			'event_venue1' : formfields.data['eventvenue1'],
			'event_date2' : formfields.data['eventdate2'],
			'event_type2' : formfields.data['eventtype2'],
			'event_venue2' : formfields.data['eventvenue2'],
			'required_outfit' : formfields.data['requiredoutfit'],
			'no_of_gowns' : formfields.data['noofgowns'],
			'preferred_silhoutte' : formfields.data['preferredoutfit'],
			'preferred_silhoutte_Others' : formfields.data['preferredoutOthers'],
			'preferred_details' : formfields.data['preferredstyle'],
			'preferred_details_Others' : formfields.data['preferredstyleOthers'],
			'preferred_Neckline' : formfields.data['preferredNeckline'],
			'preferred_Neckline_Others' : formfields.data['preferredNeckOthers'],
			}
			print(returnDict)

		return render(request, 'form.html', {'formfields': formfields})

	else:

		formfields = initialForm()



	return render(request, 'form.html', {'formfields': formfields})